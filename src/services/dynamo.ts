import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


const getTableData = async (table: string, id: string, key: PartitionKeys) => {
    const command = new GetCommand({
      TableName: table,
      Key: {
        [key]: id,
      },
    });
  
    const response = await docClient.send(command);
    console.log(response.Item);
    return response;
  };

export  const getRecipeData = async (id: string) => {
    return getTableData('reitz-recipes-data', id, PartitionKeys.RECIPE_DATA)
  }

export const getLoginData = async (id: string) => {
    return getTableData('login', id, PartitionKeys.LOGIN)
  }

  export enum PartitionKeys {
    RECIPE_DATA = 'reitz-recipe-partition-key',
    LOGIN = 'username'
  }