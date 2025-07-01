import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { routes } from "./routes";
import httpErrorHandler from "@middy/http-error-handler";
import httpCors from "@middy/http-cors";

export const handler = middy()
.use(httpCors({origin: '*'}))
.use(httpErrorHandler())
.handler(httpRouterHandler(routes))