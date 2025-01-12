import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({});

export const getTemplate = async () => {
  const command = new GetObjectCommand({
    Bucket: "reitz-recipes-templates",
    Key: "reitz-recipe-dev/test3.json",
  });

  try {
    const response = await client.send(command);
    return await response.Body?.transformToString();
  } catch (err) {
    console.error(err);
  }
};

