import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromIni } from "@aws-sdk/credential-providers";

// Initialize S3 client with environment-specific configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-2',
    credentials: fromIni({
        profile: process.env.AWS_PROFILE || 'reitzrecipes-dev'
    })
});

// Initialize AWS SDK v2 for local development
if (process.env.NODE_ENV === 'localhost') {
    require('aws-sdk').config.update({
        region: process.env.AWS_REGION || 'us-east-2'
    });
}

// Upload image with private access
export const uploadImage = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `images/${fileName}`,
        Body: fileBuffer,
        ContentType: 'image/jpeg'
    });

    await s3Client.send(command);
    return fileName;
};
