import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, Context } from "aws-lambda";
import { VerifiedUser, verifyUser } from "./login/verify";
import createHttpError from "http-errors";
import { Recipe, RECIPE_BODY_SCHEMA } from "../model/recipe";
import { writeRecipe } from "../services/dynamo";
import middy from "@middy/core";

async function postRecipe(event: APIGatewayProxyEvent, context: Context) {
    const {user, uri, recipe} = validatePostRecipeEvent(event)

    if (!user.canPost) {
        throw createHttpError(401, 'User unauthorized to post recipe')
    }

    await writeRecipe(uri, recipe)
    return {
        statusCode: 200
    }

}

function validatePostRecipeEvent(event: APIGatewayProxyEvent) {
    if (!event.pathParameters?.['id']) {
        throw createHttpError(401, "No resource provided")
    }
    return {
        user: validatePostRecipeHeaders(event.headers),
        recipe: validatePostRecipeBody(event.body),
        uri: event.pathParameters['id']
    }
}

function validatePostRecipeHeaders(headers: APIGatewayProxyEventHeaders): VerifiedUser {
    // validate authorization token
    if (!headers['Authorization']) {
        throw createHttpError(400, 'Bad Request')
    }
    const user = verifyUser(headers['Authorization'])
    return user
}

function validatePostRecipeBody(eventBody: string | null) {
    if (!eventBody) {
        throw createHttpError(400, 'No body provided')
    }
    const body = JSON.parse(eventBody)
    const bodyValidation = RECIPE_BODY_SCHEMA.safeParse(body)

    if (!bodyValidation.success) {
        throw createHttpError(400, 'Invalid Recipe')
    }

    return body as Recipe
}

export const postRecipeHandler = middy()
    .handler(postRecipe)