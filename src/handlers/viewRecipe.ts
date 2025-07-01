import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getRecipeData } from "../services/dynamo";

async function viewRecipe(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const id = event.pathParameters?.['id'];
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Recipe ID is required' })
            };
        }

        const access = await getRecipeData(id);
        
        if (access.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(access.Item)
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Recipe not found' })
        };
    } catch (error) {
        console.error('Error viewing recipe:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    } finally {
        // Clean up any resources if needed
        context.callbackWaitsForEmptyEventLoop = false;
    }
}

export const viewRecipeHandler = middy(viewRecipe)
    .handler(viewRecipe)