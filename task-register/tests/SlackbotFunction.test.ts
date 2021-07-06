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
import { RegisterTaskDomainService } from '../Domain/RegisterTaskDomainService';
import { SingleLineTaskExtractorHandler } from '../Domain/SingleLineTaskExtractorHandler';

const REGION = 'us-east-1';

const credentials = new SharedIniFileCredentials({ profile: 'tt-admin' });

const mapper = new DataMapper({
  client: new DynamoDB({ region: REGION, credentials }), // the SDK client used to execute operations
});

describe('Handling slack commands to register tasks', () => {
  describe('Considering simple valid command patterns', () => {
    let command:any = {
      user_id: 'U026MEY5J8G',
      user_name: 'richardleecba',
    };

    it('Today: design check 2hs -> Should saves on database 1 Task', async () => {
      // Arrange
      const registerTaskDomainService = new RegisterTaskDomainService(new SingleLineTaskExtractorHandler());
      command = { ...command, text: 'Today: design check 2hs' };

      const tasks = registerTaskDomainService.generateTasksFrom(command.text, command.user_id, command.user_name);

      for (const task of tasks) {
        console.log('2');
        const objectSaved = await mapper.put(task);
        console.log(objectSaved);
      }
    });
  });
});
