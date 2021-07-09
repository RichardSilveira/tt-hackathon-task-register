import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { SharedIniFileCredentials } from 'aws-sdk';
import Task from './Task';

const REGION = process.env.REGION;
const LAMBDA_ENV = process.env.LAMBDA_ENV;
console.log({ REGION, LAMBDA_ENV });

const dynamoDBOptions = LAMBDA_ENV !== 'local' ? { region: REGION, correctClockSkew: true }
  : { region: REGION, correctClockSkew: true, credentials: new SharedIniFileCredentials({ profile: 'tt-admin' }) };

const mapper = new DataMapper({
  client: new DynamoDB(dynamoDBOptions), // the SDK client used to execute operations
});

export default class TasksQueryService {
  async getTasksByEmployee(employeeId) {
    try {
      let formatted = [];
      const groupByDate = {};
      const iterator = mapper.query(Task, {
        employeeId,
      });

      for await (const record of iterator) {
        const date = new Date(record.registeredAt);
        const keyDate = `${date.getMonth() + 1}/${date.getDate()}`;
        if (typeof groupByDate[keyDate] === 'undefined') groupByDate[keyDate] = [];
        groupByDate[keyDate].push(record);
      }

      // eslint-disable-next-line guard-for-in
      for (const key in groupByDate) {
        formatted.push({
          date: key,
          tasks: groupByDate[key],
        });
      }

      formatted = formatted.sort((a, b) => {
        function dateToValue(date) {
          const dateSplit = date.split('/');
          return parseInt(dateSplit[0]) * 100 + parseInt(dateSplit[1]);
        }

        return dateToValue(b.date) - dateToValue(a.date);
      });

      return formatted;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
