import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import path from 'path'

export function verifyUser(header: string): VerifiedUser {
    const token = header.split(" ")[1]
    process.env.SECRET_KEY ='default'

    if (!process.env.SECRET_KEY) {
        throw createHttpError(401, 'Error verifying user - unable to find secret key')
    }

    if (!token) {
        throw createHttpError(401, 'Error verifying user - no token provided')
    }

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        return {
            username: user['username'],
            canPost: user['canPost']
        }
    } catch (error) {
        throw createHttpError(403, 'Unauthorized')
    }
    
}

export interface VerifiedUser {
    username: string
    canPost: boolean
}