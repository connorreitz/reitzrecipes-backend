import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { routes } from "./routes";
import httpErrorHandler from "@middy/http-error-handler";
import dotenv from 'dotenv'
import httpCors from "@middy/http-cors";

if (process.env.NODE_ENV === "localhost") {
    console.log("setting env file")
    dotenv.config()
}

export const handler = middy()
.use(httpCors({origin: '*'}))
.use(httpErrorHandler())
.handler(httpRouterHandler(routes))