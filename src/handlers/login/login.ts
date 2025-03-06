import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import createError from 'http-errors'
import { getLoginData } from "../../services/dynamo";
import jwt from 'jsonwebtoken'
import middy from "@middy/core";
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY ?? 'default'

async function login(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    if (!event.body) {
        throw createError(400, 'Bad request')
    }

    if (!SECRET_KEY) {
        throw createError(500, 'Internal Server Error Key')
    }

    const {username, password} = JSON.parse(event.body)

    try {
        const storedPassword = getLoginData(username)
        if (password === (await storedPassword).Item?.['password']) {
            const token = jwt.sign(
                {userId: username, canPost: true},
                SECRET_KEY,
                {
                    expiresIn: '24h'
                }
            )

            return {
                statusCode: 200,
                body: JSON.stringify({
                    token
                })
            }
        } else {
            throw createError(401, 'Invalid credentials')
        }

    } catch (e) {
        throw createError(500, 'Error with login: ', e)
    }

}

export const loginHandler = middy()
    .handler(login)