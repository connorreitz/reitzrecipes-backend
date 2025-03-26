import { loginHandler } from "./handlers/login/login";
import { postRecipeHandler } from "./handlers/postRecipe";
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
    },
    {
        method: 'POST' as const,
        path: '/recipe/{id}',
        handler: postRecipeHandler
    }
]