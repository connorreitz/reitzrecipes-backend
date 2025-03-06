import { loginHandler } from "./handlers/login/login";
import { viewReciperHandler } from "./handlers/viewRecipe";

export const routes = [
    {
        method: 'GET' as const,
        path: '/recipe/{id}',
        handler: viewReciperHandler
    },
    {
        method: 'POST' as const,
        path: '/login',
        handler: loginHandler
    }
]