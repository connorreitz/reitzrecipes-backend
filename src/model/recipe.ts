/**
 * recipe model for Dynamo
 */

import { z } from "zod";

export interface Recipe {
    description: string;
    ingredients: Array<Ingredient>;
    servings: number;
    source: string;
    steps: string;
    title: string;
    
}

export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

// validation against post event body
export const RECIPE_BODY_SCHEMA = z.object({
    description: z.string(),
    ingredients: z.array(
        z.object({
            name: z.string(),
            amount: z.number(),
            unit: z.string()
        })
    ).min(1),
    servings: z.number(),
    source: z.string(),
    steps: z.string(),
    title: z.string()
})