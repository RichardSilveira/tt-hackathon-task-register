var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
Valid command sample -> \tt
token=RJif0eNEGkMmcYDlep6j7CKQ&team_id=T025UPB4G8M
&team_domain=timetrackerha-lmb4637
&channel_id=C026PR301LL&channel_name=test
&user_id=U026MEY5J8G&user_name=richardleecba
&command=%2Ftt
&text=asddasd&api_app_id=A02641AKNLU&is_enterprise_install=false
&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT025UPB4G8M%2F2235497595910%2F2w0f0vPOiCboETliTKwoLZNe
&trigger_id=2227522643159.2198793152293.6ed1a23699438bef5d496896bf3be0d7
 */
import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { SharedIniFileCredentials } from 'aws-sdk';
import { RegisterTaskDomainService } from '../src/Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from '../src/Domain/SingleLineTaskExtractorHandler';
const REGION = process.env.REGION;
const LAMBDA_ENV = process.env.LAMBDA_ENV;
console.log({ REGION, LAMBDA_ENV });
const dynamoDBOptions = LAMBDA_ENV !== 'local' ? { region: REGION, correctClockSkew: true }
    : { region: REGION, correctClockSkew: true, credentials: new SharedIniFileCredentials({ profile: 'tt-admin' }) };
const mapper = new DataMapper({
    client: new DynamoDB(dynamoDBOptions), // the SDK client used to execute operations
});
describe('Handling slack commands to register tasks', () => {
    describe('Considering simple valid command patterns', () => {
        let command = {
            user_id: 'U026MEY5J8G',
            user_name: 'richardleecba',
        };
        it('When a command with a list of tasks are informed, should saves it on the database in AWS Dev environment', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());
            command = Object.assign(Object.assign({}, command), { text: 'Today: design check 2hs, meetings 1h, code review 3 hs' });
            const tasks = registerTaskDomainService.generateTasksFrom(command.text, command.user_id, command.user_name);
            // Act
            const saveTasksAsync = [];
            for (const task of tasks) {
                saveTasksAsync.push(mapper.put(task));
            }
            const tasksSaved = yield Promise.all(saveTasksAsync);
            // Assert
            expect(tasksSaved.length).toBe(3);
        }));
    });
});
//# sourceMappingURL=SlackbotFunction.test.js.map