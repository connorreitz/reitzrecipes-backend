import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { uploadImage } from "../services/s3";
import createHttpError from "http-errors";
import middy from "@middy/core";

async function uploadImageFunction(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    if (!event.body) {
        throw createHttpError(400, 'No image data provided');
    }

    const body = JSON.parse(event.body);
    if (!body.imageData || !body.fileName) {
        throw createHttpError(400, 'Missing required fields: imageData and fileName');
    }

    try {
        // Convert base64 image data to Buffer
        const buffer = Buffer.from(body.imageData, 'base64');
        const imageUrl = await uploadImage(buffer, body.fileName);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ imageUrl })
        };
    } catch (error) {
        throw createHttpError(500, 'Error uploading image');
    }
}

export const uploadImageHandler = middy()
    .handler(uploadImageFunction);
