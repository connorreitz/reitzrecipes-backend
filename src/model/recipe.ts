/**
 * Receipe model for Dynamo
 */

export interface Recipe {
    ingredients: Array<Ingredient>;
    steps: string;
    description: string;
}

export interface Ingredient {
    name: string
    amount: number
    unit: string
}