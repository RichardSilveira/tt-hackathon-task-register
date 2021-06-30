const AWS = require('aws-sdk');
const registerTaskSampleJson = require('./registerTaskSample.json');

AWS.config.update({ region: process.env.REGION });

const stage = process.env.STAGE;
const region = process.env.REGION;

function logMetadata() {
  console.log('environment variables:', {
    stage,
    region,
  });
}

/* ngrok sample:
 curl -X POST https://413e23aed16d.ngrok.io/tasks -H "Content-Type: application/json" -d @registerTaskSample.json
 */
// curl -X POST http://localhost:4000/dev/tasks -H "Content-Type: application/json" -d @registerTaskSample.json
// POST - https://4t6blqidpl.execute-api.us-east-1.amazonaws.com/dev/tasks
export const registerTasks = async (event, context) => {
  logMetadata();
  console.log('6'); // testing the hot reloading changes

  const registerTaskReq = JSON.parse(event.body);
  console.log(registerTaskReq);

  const registerTaskModel = registerTaskSampleJson;
  console.log(registerTaskModel);

  // todo: configure dynamodbmapper: https://www.one-tab.com/page/kRWYhVKPRpKwreAJa3WRNw

  return {
    statusCode: 201,
    body: JSON.stringify({
      data: registerTaskModel,
    }),
  };
};

// npm i -g json ->
// curl http://localhost:4000/dev/tasks/005013b9-6eb0-4d7d-a524-c506186ec071 -H "Content-Type: application/json" | json
// GET - https://4t6blqidpl.execute-api.us-east-1.amazonaws.com/dev/tasks/{employeeId}
export const getTasks = async (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    data: [registerTaskSampleJson,
      { ...registerTaskSampleJson, taskDescription: 'Code review 2', taskTime: 3 },
      { ...registerTaskSampleJson, taskDescription: 'meetings 8', taskTime: 4 }],
  }),
});
