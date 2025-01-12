import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getTableData } from "../services/dyanmoService";

const viewRecipe = async (event: APIGatewayEvent, context: Context) => {
    const access = await getTableData(event.pathParameters!['id']!)
    if (access) {
        const response: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(access.Item)
        }

        return response
    }
    
    
    return {statusCode: 500, body: 'no info found'}
}

export const viewReciperHandler = middy()
    .handler(viewRecipe)