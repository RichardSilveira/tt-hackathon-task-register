import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { SharedIniFileCredentials } from 'aws-sdk';
import { RegisterTaskDomainService } from '../Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from '../Domain/SingleLineTaskExtractorHandler';
import TasksQueryService from '../Domain/TasksQueryService';

const REGION = 'us-east-1';

// For local tests only (using profile)
const credentials = new SharedIniFileCredentials({ profile: 'tt-admin' });

const mapper = new DataMapper({
  client: new DynamoDB({ region: REGION, credentials }), // the SDK client used to execute operations
});

let command:any = {
  user_id: 'douglassoares',
  user_name: 'douglassoares',
};

describe('Retrieving user worked hours', () => {
  beforeAll(async () => {
    const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());
    command = { ...command, text: 'Today: design check 2hs, meetings 1h, code review 3 hs' };
    const tasks = registerTaskDomainService.generateTasksFrom(command.text, command.user_id, command.user_name);
    const saveTasksAsync = [];
    for (const task of tasks) {
      saveTasksAsync.push(mapper.put(task));
    }
    await Promise.all(saveTasksAsync);
  });

  it('Should retrieve tasks grouped by date', async () => {
    const tasks = await new TasksQueryService().getTasksByEmployee(command.user_id);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it('Building the expected Task block for the Slack Home Page', async () => {
    const tasksGroupedByDate = await new TasksQueryService().getTasksByEmployee(command.user_id);

    const sections = tasksGroupedByDate.map((groupedTask) => {
      const date = new Date(groupedTask.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const dayOfMonth = date.getDate();

      const taskDescriptions = groupedTask.tasks.map((task) => `•  ${task.taskTime}h: ${task.taskDescription} - <https://google.com|Delete> \n`).join('\n');

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

    console.log(sections);
    expect(sections.length).toBeGreaterThan(0);
  });
});
