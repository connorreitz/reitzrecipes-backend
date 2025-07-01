import { AttributeValue, DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Ingredient, Recipe } from "../model/recipe";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const getTableData = async (table: string, id: string, key: PartitionKeys): Promise<any> => {
    try {
        const command = new GetCommand({
            TableName: table,
            Key: {
                [key]: id
            }
        });

        const response = await docClient.send(command);
        console.log(response.Item);
    return response;
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        throw error;
    }
};  

export const getRecipeData = async (id: string) => {
  return getTableData('reitz-recipes-data', id, PartitionKeys.RECIPE_DATA)
  }

export const getLoginData = async (id: string) => {
  return getTableData('login', id, PartitionKeys.LOGIN)
  }

export const writeRecipe = async (resource: string, recipe: Recipe) => {
	const command = new PutItemCommand({
		ConditionExpression: "attribute_not_exists(#pk)",
		Item: {
			"reitz-recipe-partition-key": {
				"S": resource
			},
			"description": {
				"S": recipe.description
			},
			"ingredients": {
				"L": 
					buildIngredientList(recipe.ingredients) as unknown as Array<AttributeValue>
			},
			"servings": {
				"N": recipe.servings.toString()
			},
			"source": {
				"S": recipe.source
			},
			"steps": {
				"S": recipe.steps
			},
			"title": {
				"S": recipe.title
			}
		},
		TableName: 'reitz-recipes-data',
		ExpressionAttributeNames: {
			"#pk": "reitz-recipe-partition-key"
		}
	})

	await docClient.send(command)
}

export async function getListOfItems(tableName: string, n: number) {
	const command = new ScanCommand({
		TableName: tableName,
		Limit: n
	})

	const response = await docClient.send(command);
    return response.Items;
}

function buildIngredientList(ingredients: Array<Ingredient>) {
	const test = ingredients.map((ingredient) => {
		return {
			"M": {
				"amount": {
					"N": ingredient.amount.toString()
				},
				"name": {
					"S": ingredient.name
				},
				"unit": {
					"S": ingredient.unit
				}
			}
		}
		
	})
	return test
}

export enum PartitionKeys {
    RECIPE_DATA = 'reitz-recipe-partition-key',
    LOGIN = 'username'
  }