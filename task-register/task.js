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
// curl -X POST http://localhost:4000/dev/tasks -H "Content-Type: application/json" -d @registerTaskSample.json
export const registerTasks = async (event, context) => {
  logMetadata();
  console.log('3'); // testing the hot reloading changes

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
export const getTasks = async (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    data: [registerTaskSampleJson,
      { ...registerTaskSampleJson, taskDescription: 'Code review', taskTime: 3 },
      { ...registerTaskSampleJson, taskDescription: 'meetings', taskTime: 4 }],
  }),
});
