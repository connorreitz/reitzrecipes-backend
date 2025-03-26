import { AttributeValue, ConditionalOperator, DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Ingredient, Recipe } from "../model/recipe";
import { build } from "esbuild";

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
	console.log('test: ', test)
	return test
}

export enum PartitionKeys {
    RECIPE_DATA = 'reitz-recipe-partition-key',
    LOGIN = 'username'
  }