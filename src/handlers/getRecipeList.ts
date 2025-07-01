import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getListOfItems } from "../services/dynamo";

async function getRecipeList(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const access = await getListOfItems('reitz-recipes-data', 5)
    if (access) {
        const response: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(access)
        }

        return response
    }
    
    return {statusCode: 404, body: 'no info found'}
}

export const getRecipeListHandler = middy()
    .handler(getRecipeList)