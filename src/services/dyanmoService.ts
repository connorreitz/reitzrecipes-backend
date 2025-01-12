import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const getTableData = async (id: string) => {
    const command = new GetCommand({
      TableName: "reitz-recipes-data",
      Key: {
        'reitz-recipe-partition-key': id,
      },
    });
  
    const response = await docClient.send(command);
    console.log(response.Item);
    return response;
  };