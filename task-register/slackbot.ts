/* eslint-disable @typescript-eslint/no-explicit-any */

import type { APIGatewayProxyHandler } from 'aws-lambda';

import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { App, AwsLambdaReceiver } from '@slack/bolt';
import { SharedIniFileCredentials } from 'aws-sdk';
import { RegisterTaskDomainService } from './Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from './Domain/SingleLineTaskExtractorHandler';
import Task from './Domain/Task';
// import Task from 'Domain/Task';

const STAGE = process.env.STAGE;
const REGION = process.env.REGION;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_USER_TOKEN = process.env.SLACK_BOT_TOKEN;
const LAMBDA_ENV = process.env.LAMBDA_ENV;

function logMetadata() {
  console.log('environment variables:', {
    STAGE,
    REGION,
    SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN,
    SLACK_USER_TOKEN,
    LAMBDA_ENV,
  });
}

// For local tests only (using profile)
const credentials = new SharedIniFileCredentials({ profile: 'tt-admin' });
const dynamoDBOptions = LAMBDA_ENV === 'local' ? { region: REGION, correctClockSkew: true, credentials } : { region: REGION };

const mapper = new DataMapper({
  client: new DynamoDB(dynamoDBOptions), // the SDK client used to execute operations
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
  console.log('2');

  try {
    const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());

    const tasks = registerTaskDomainService.generateTasksFrom(command.text, command.user_id, command.user_name);

    const saveTasksAsync = [];
    for (const task of tasks) {
      saveTasksAsync.push(mapper.put(task));
    }

    const tasksSaved = await Promise.all<Task>(saveTasksAsync);

    const tasksSavedToStr = JSON.stringify(tasksSaved);
    console.log(tasksSavedToStr);

    const registeredDate = new Date(tasks[0].registeredAt);

    const month = registeredDate.toLocaleString('default', { month: 'long' });
    const dayOfMonth = registeredDate.getDate();
    const taskDescriptions = tasksSaved.map((task) => `•  ${task.taskTime}h: ${task.taskDescription} - <https://google.com|Delete> \n`).join('\n');

    const blocks = [{
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:calendar: *${month}, ${dayOfMonth}th* \n\n ${taskDescriptions}`,
      },
    },
    {
      type: 'actions',
      elements: [{
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Edit',
          emoji: true,
        },
        value: 'click_me_123',
      }],
    }];

    // const blocks = [{
    //   type: 'actions',
    //   elements: [{
    //     type: 'button',
    //     text: {
    //       type: 'plain_text',
    //       text: 'Edit',
    //       emoji: true,
    //     },
    //     value: 'click_me_123',
    //   }],
    // }];

    await say({ blocks });
    // await say({
    //   blocks: [{
    //     "type": "section",
    //     "text": {
    //       "type": "mrkdwn",
    //       "text": "Pick a date for me to remind you"
    //     },
    //     "accessory": {
    //       "type": "datepicker",
    //       "action_id": "datepicker_remind",
    //       "initial_date": "2019-04-28",
    //       "placeholder": {
    //         "type": "plain_text",
    //         "text": "Select a date"
    //       }
    //     }
    //   }]
    // });

    // await say(blocks);
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
