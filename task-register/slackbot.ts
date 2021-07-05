/* eslint-disable @typescript-eslint/no-explicit-any */

import type { APIGatewayProxyHandler } from 'aws-lambda';

import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { App, AwsLambdaReceiver } from '@slack/bolt';
import { RegisterTaskDomainService } from './Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from './Domain/SingleLineTaskExtractorHandler';
// import Task from 'Domain/Task';

const STAGE = process.env.STAGE;
const REGION = process.env.REGION;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_USER_TOKEN = process.env.SLACK_BOT_TOKEN;

function logMetadata() {
  console.log('environment variables:', {
    STAGE,
    REGION,
    SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN,
    SLACK_USER_TOKEN,
  });
}

const mapper = new DataMapper({
  client: new DynamoDB({ region: REGION }), // the SDK client used to execute operations
});

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
});

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

app.command('/tt', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();
  console.log('test 4');
  console.log('test 5');

  try {
    const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());

    const tasks = registerTaskDomainService.generateTasksFrom(command.text, command.user_id, command.user_name);
    const task = tasks[0];
    console.log(task);

    const objectSaved = await mapper.put(task);
    console.log(objectSaved);

    await say(`${objectSaved} to ${command.user_name} | ${command.user_id}`);
  } catch (e) {
    console.log(e);
  }
});

export const events: APIGatewayProxyHandler = async (event, context) => {
  logMetadata();

  console.log('event.body:', event.body);

  const bolt: any = await app.start();

  return bolt(event, context);
};
