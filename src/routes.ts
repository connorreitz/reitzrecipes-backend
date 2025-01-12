import { viewReciperHandler } from "./handlers/viewRecipe";

export const routes = [
    {
        method: 'GET' as const,
        path: '/recipe/{id}',
        handler: viewReciperHandler
    }
]