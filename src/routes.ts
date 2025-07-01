import { getRecipeListHandler } from "./handlers/getRecipeList";
import { loginHandler } from "./handlers/login/login";
import { postRecipeHandler } from "./handlers/postRecipe";
import { viewRecipeHandler } from "./handlers/viewRecipe";

import { uploadImageHandler } from "./handlers/uploadImage";

export const routes = [
    {
        method: 'GET' as const,
        path: '/recipe/{id}',
        handler: viewRecipeHandler
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
    },
    {
        method: 'GET' as const,
        path: '/recipes',
        handler: getRecipeListHandler
    },
    {
        method: 'POST' as const,
        path: '/upload-image',
        handler: uploadImageHandler
    }
]