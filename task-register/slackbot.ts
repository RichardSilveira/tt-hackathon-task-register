import { APIGatewayProxyHandler } from 'aws-lambda';
import { App, AwsLambdaReceiver, ReceiverEvent } from '@slack/bolt';

// import Task from 'Domain/Task';

const { STAGE } = process.env;
const { REGION } = process.env;
const { SLACK_SIGNING_SECRET } = process.env;
const { SLACK_BOT_TOKEN } = process.env;
const { SLACK_USER_TOKEN } = process.env;

function logMetadata() {
  console.log('environment variables:', {
    STAGE,
    REGION,
    SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN,
    SLACK_USER_TOKEN,
  });
}

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

  // const task = new Task();

  // task.employeeId = command.user_id;

  try {
    // command.user_id

    await say(`${command.text} to ${command.user_name}`);
  } catch (e) {
    console.log(e);
  }
});

export async function events(event, context) {
  logMetadata();

  console.log('event.body:', event.body);

  const bolt:any = await app.start();

  return bolt(event, context);
}
