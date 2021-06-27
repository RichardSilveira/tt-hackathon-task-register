export const registerTasks = async (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'Go Serverless v2.0!',
  }),
});

export const getTasks = async (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'Go Serverless v2.0!',
  }),
});
