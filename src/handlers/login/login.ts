import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import createError from 'http-errors'
import { getLoginData } from "../../services/dynamo";
import jwt from 'jsonwebtoken'
import middy from "@middy/core";
import bcrypt from 'bcryptjs';

async function login(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {

    const SECRET_KEY = process.env.SECRET_KEY

    if (!event.body) {
        throw createError(400, 'Bad request')
    }

    if (!SECRET_KEY) {
        throw createError(500, 'Internal Server Error - Secret Key')
    }

    const {username, password} = JSON.parse(event.body)

    try {
        const storedPassword = getLoginData(username)
        const isPasswordValid = await bcrypt.compare(password, (await storedPassword).Item?.['password'])
        if (isPasswordValid) {
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
        throw createError(500, `Error with login: ${e}`)
    }

}

export const loginHandler = middy()
    .handler(login)