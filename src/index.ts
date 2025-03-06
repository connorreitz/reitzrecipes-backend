import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { routes } from "./routes";
import httpCors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";

export const handler = middy()
.use(httpCors({origin: '*'}))
.use(httpErrorHandler())
.handler(httpRouterHandler(routes))