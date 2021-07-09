var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { SharedIniFileCredentials } from 'aws-sdk';
import { RegisterTaskDomainService } from '../src/Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from '../src/Domain/SingleLineTaskExtractorHandler';
import TasksQueryService from '../src/Domain/TasksQueryService';
const REGION = process.env.REGION;
const LAMBDA_ENV = process.env.LAMBDA_ENV;
console.log({ REGION, LAMBDA_ENV });
const dynamoDBOptions = LAMBDA_ENV !== 'local' ? { region: REGION, correctClockSkew: true }
    : { region: REGION, correctClockSkew: true, credentials: new SharedIniFileCredentials({ profile: 'tt-admin' }) };
const mapper = new DataMapper({
    client: new DynamoDB(dynamoDBOptions), // the SDK client used to execute operations
});
let command = {
    user_id: 'douglassoares',
    user_name: 'douglassoares',
};
describe('Retrieving user worked hours', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());
        command = Object.assign(Object.assign({}, command), { text: 'Today: design check 2hs, meetings 1h, code review 3 hs' });
        const tasks = registerTaskDomainService.generateTasksFrom(command.text, command.user_id, command.user_name);
        const saveTasksAsync = [];
        for (const task of tasks) {
            saveTasksAsync.push(mapper.put(task));
        }
        yield Promise.all(saveTasksAsync);
    }));
    it('Should retrieve tasks grouped by date', () => __awaiter(void 0, void 0, void 0, function* () {
        const tasks = yield new TasksQueryService().getTasksByEmployee(command.user_id);
        expect(tasks.length).toBeGreaterThan(0);
    }));
    it('Building the expected Task block for the Slack Home Page', () => __awaiter(void 0, void 0, void 0, function* () {
        const tasksGroupedByDate = yield new TasksQueryService().getTasksByEmployee(command.user_id);
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
            return section;
        });
        expect(sections.length).toBeGreaterThan(0);
    }));
});
//# sourceMappingURL=TasksQueryService.test.js.map