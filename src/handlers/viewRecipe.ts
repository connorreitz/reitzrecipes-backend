import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getRecipeData } from "../services/dynamo";

async function viewRecipe(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const access = await getRecipeData(event.pathParameters!['id']!)
    if (access) {
        const response: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(access.Item)
        }

        return response
    }
    
    
    return {statusCode: 404, body: 'no info found'}
}

export const viewReciperHandler = middy()
    .handler(viewRecipe)