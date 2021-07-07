/* eslint-disable @typescript-eslint/no-explicit-any */

import type { APIGatewayProxyHandler } from 'aws-lambda';

import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';

import { App, AwsLambdaReceiver } from '@slack/bolt';
import { SharedIniFileCredentials } from 'aws-sdk';
import { WebClient } from '@slack/web-api';
import { RegisterTaskDomainService } from './Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from './Domain/SingleLineTaskExtractorHandler';
import Task from './Domain/Task';
import TasksQueryService from './Domain/TasksQueryService';
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

app.command('/tt', async ({
  command, ack, say, client, respond,
}) => {
  // Acknowledge command request
  await ack();
  console.log('2');

  try {
    const tasksSaved = await saveTasks(command);

    const tasksSavedToStr = JSON.stringify(tasksSaved);
    console.log(tasksSavedToStr);

    const registeredDate = tasksSaved[0].registeredAt;

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

    await updateUserHomeTab(client, command.user_id);
    await say({ blocks });
  } catch (e) {
    console.log(e);
  }
});

const getSectionDescription = (groupedTasks) => {
  const sections = groupedTasks.map((groupedTask) => {
    const date = new Date(groupedTask.date);
    const month = date.toLocaleString('default', { month: 'long' });
    const dayOfMonth = date.getDate();

    const taskDescriptions = groupedTask.tasks.map((task) => `•  ${task.taskTime}h: ${task.taskDescription}\n`).join('\n');

    const section = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:calendar: *${month}, ${dayOfMonth}th* \n\n ${taskDescriptions}`,
      },
    };

    console.log(section);

    return section;
  });

  return sections;
};

const getHomeMainSection = (sectionDescriptionBlock) => [{
  type: 'header',
  text: {
    type: 'plain_text',
    text: 'Add your daily tasks',
  },
},
{
  type: 'actions',
  elements: [
    {
      type: 'datepicker',
      placeholder: {
        type: 'plain_text',
        text: 'Pick a date',
        emoji: true,
      },
      action_id: 'actionId-0',
    },
    {
      type: 'static_select',
      placeholder: {
        type: 'plain_text',
        text: '1h',
        emoji: true,
      },
      options: [
        {
          text: {
            type: 'plain_text',
            text: '1h',
            emoji: true,
          },
          value: 'value-0',
        },
        {
          text: {
            type: 'plain_text',
            text: '2h',
            emoji: true,
          },
          value: 'value-1',
        },
        {
          text: {
            type: 'plain_text',
            text: '3h',
            emoji: true,
          },
          value: 'value-2',
        },
        {
          text: {
            type: 'plain_text',
            text: '4h',
            emoji: true,
          },
          value: 'value-3',
        },
        {
          text: {
            type: 'plain_text',
            text: '5h',
            emoji: true,
          },
          value: 'value-4',
        },
      ],
      action_id: 'actionId-1',
    },
    {
      type: 'static_select',
      placeholder: {
        type: 'plain_text',
        text: 'Task description',
        emoji: true,
      },
      options: [
        {
          text: {
            type: 'plain_text',
            text: 'Code review',
            emoji: true,
          },
          value: 'value-0',
        },
        {
          text: {
            type: 'plain_text',
            text: 'Deployment',
            emoji: true,
          },
          value: 'value-1',
        },
        {
          text: {
            type: 'plain_text',
            text: 'Environment setup',
            emoji: true,
          },
          value: 'value-2',
        },
        {
          text: {
            type: 'plain_text',
            text: 'Bug Fixing',
            emoji: true,
          },
          value: 'value-3',
        },
      ],
      action_id: 'actionId-4',
    },
    {
      type: 'static_select',
      placeholder: {
        type: 'plain_text',
        text: 'Focal point',
        emoji: true,
      },
      options: [
        {
          text: {
            type: 'plain_text',
            text: 'Andre Young',
            emoji: true,
          },
          value: 'value-0',
        },
        {
          text: {
            type: 'plain_text',
            text: 'Jane Doe',
            emoji: true,
          },
          value: 'value-1',
        },
      ],
      action_id: 'actionId-3',
    },
  ],
},
{
  type: 'actions',
  elements: [
    {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Register Task',
        emoji: true,
      },
      value: 'register_task',
    },
  ],
},
{
  type: 'divider',
},
{
  type: 'actions',
  elements: [
    {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Generate Monthly report',
        emoji: true,
      },
      value: 'new_configuration',
      style: 'primary',
    },
  ],
},
{
  type: 'divider',
},
{
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: '*Registered tasks*',
  },
},
{
  type: 'divider',
},
...sectionDescriptionBlock];
const updateUserHomeTab = async (client:WebClient, userId: string) => {
  const tasksGroupedByDate = await new TasksQueryService().getTasksByEmployee(userId);

  const registeredTasksSection = getSectionDescription(tasksGroupedByDate);

  const blocks = getHomeMainSection(registeredTasksSection);
  // const blocks = tasks.map(task => {
  //   const registeredDate = task.registeredAt;
  //
  //   const month = registeredDate.toLocaleString('default', { month: 'long' });
  //   const dayOfMonth = registeredDate.getDate();
  //
  //   const taskDescriptions = task.map((task) => `•  ${task.taskTime}h: ${task.taskDescription} - <https://google.com|Delete> \n`).join('\n');
  //
  // })
  // const blocks = [{
  //   type: 'section',
  //   text: {
  //     type: 'mrkdwn',
  //     text: `:calendar: *${month}, ${dayOfMonth}th* \n\n ${taskDescriptions}`,
  //   },
  // },
  //   {
  //     type: 'actions',
  //     elements: [{
  //       type: 'button',
  //       text: {
  //         type: 'plain_text',
  //         text: 'Edit',
  //         emoji: true,
  //       },
  //       value: 'click_me_123',
  //     }],
  //   }];

  return client.views.publish({
    token: SLACK_BOT_TOKEN,
    user_id: userId,
    view: {
      type: 'home',
      blocks,
    },
  });
};

export const events: APIGatewayProxyHandler = async (event, context) => {
  logMetadata();

  console.log('event.body:', event.body);

  const bolt: any = await app.start();

  return bolt(event, context);
};

export const saveTasks = async ({ text, user_id, user_name }) => {
  const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());

  const tasks = registerTaskDomainService.generateTasksFrom(text, user_id, user_name);

  const saveTasksAsync = [];
  for (const task of tasks) {
    saveTasksAsync.push(mapper.put(task));
  }

  const tasksSaved = await Promise.all<Task>(saveTasksAsync);

  console.log('TASKS SAVED: ', tasksSaved);
  return tasksSaved;
};
