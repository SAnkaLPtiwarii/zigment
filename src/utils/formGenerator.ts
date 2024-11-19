// src/utils/formGenerator.ts
import * as z from "zod";
import { Schema } from "@/types/schema";

type ValidationSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;

const createFieldSchema = (field: Schema['fields'][0]): z.ZodTypeAny => {
    let baseSchema: z.ZodTypeAny;

    // Create base schema based on field type
    switch (field.type) {
        case 'email':
            baseSchema = z.string().email(field.validation?.message);
            break;
        case 'number':
            baseSchema = z.number();
            break;
        default:
            baseSchema = z.string();
    }

    // Add validation rules
    if (field.validation) {
        if (field.type === 'number') {
            const numSchema = baseSchema as z.ZodNumber;
            if (typeof field.validation.min === 'number') {
                baseSchema = numSchema.min(field.validation.min);
            }
            if (typeof field.validation.max === 'number') {
                baseSchema = numSchema.max(field.validation.max);
            }
        } else {
            const strSchema = baseSchema as z.ZodString;
            if (field.validation.pattern) {
                baseSchema = strSchema.regex(
                    new RegExp(field.validation.pattern),
                    field.validation.message
                );
            }
            if (field.validation.minLength) {
                baseSchema = strSchema.min(
                    field.validation.minLength,
                    `Minimum length is ${field.validation.minLength}`
                );
            }
            if (field.validation.maxLength) {
                baseSchema = strSchema.max(
                    field.validation.maxLength,
                    `Maximum length is ${field.validation.maxLength}`
                );
            }
        }
    }

    // Make optional if not required
    return field.required ? baseSchema : baseSchema.optional();
};

export const generateValidationSchema = (schema: Schema): ValidationSchema => {
    const shape: Record<string, z.ZodTypeAny> = {};

    schema.fields.forEach((field) => {
        shape[field.id] = createFieldSchema(field);
    });

    return z.object(shape);
};

