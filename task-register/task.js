export const registerTasks = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Go Serverless v2.0! ${(await message({time: 1, copy: 'Your function executed successfully!'}))}`,
        }),
    };
}

export const getTasks = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Go Serverless v2.0! ${(await message({time: 1, copy: 'Your function executed successfully!'}))}`,
        }),
    };
}
