import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { routes } from "./routes";
import httpCors from "@middy/http-cors";

export const handler = middy()
.use(httpCors({origin: '*'}))
.handler(httpRouterHandler(routes))