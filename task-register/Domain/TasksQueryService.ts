import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { SharedIniFileCredentials } from 'aws-sdk';
import Task from './Task';

const REGION = 'us-east-1';

// For local tests only (using profile)
const credentials = new SharedIniFileCredentials({ profile: 'tt-admin' });

const mapper = new DataMapper({
  client: new DynamoDB({ region: REGION, credentials }), // the SDK client used to execute operations
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
