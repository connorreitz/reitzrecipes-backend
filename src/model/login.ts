import { z } from "zod";

export const LOGIN_HANDLER_SCHEMA = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(50)
})