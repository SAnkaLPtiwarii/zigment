// src/utils/jsonValidator.ts
import { Schema, Field, FieldType } from "@/types/schema";

interface ValidationResult {
    isValid: boolean;
    errors?: string[];
}

const isValidFieldType = (type: string): type is FieldType => {
    const validTypes = [
        'text',
        'email',
        'select',
        'radio',
        'textarea',
        'number',
        'checkbox'
    ];
    return validTypes.includes(type);
};

const validateField = (field: Partial<Field>, index: number): string[] => {
    const errors: string[] = [];

    if (!field.id) {
        errors.push(`Field at index ${index} must have an id`);
    }

    if (!field.type) {
        errors.push(`Field at index ${index} must have a type`);
    } else if (!isValidFieldType(field.type)) {
        errors.push(`Field at index ${index} has invalid type: ${field.type}`);
    }

    if (!field.label) {
        errors.push(`Field at index ${index} must have a label`);
    }

    if (field.type === "select" || field.type === "radio") {
        if (!Array.isArray(field.options) || field.options.length === 0) {
            errors.push(`Field ${field.id || `at index ${index}`} must have non-empty options array`);
        } else {
            field.options.forEach((option, optionIndex) => {
                if (!option.value) {
                    errors.push(`Option ${optionIndex} in field ${field.id} must have a value`);
                }
                if (!option.label) {
                    errors.push(`Option ${optionIndex} in field ${field.id} must have a label`);
                }
            });
        }
    }

    if (field.validation) {
        if (field.type === 'email' && field.validation.pattern) {
            try {
                new RegExp(field.validation.pattern);
            } catch {
                errors.push(`Invalid email pattern in field ${field.id}`);
            }
        }

        if (field.type === 'number') {
            if (field.validation.min !== undefined && typeof field.validation.min !== 'number') {
                errors.push(`Invalid min value in field ${field.id}`);
            }
            if (field.validation.max !== undefined && typeof field.validation.max !== 'number') {
                errors.push(`Invalid max value in field ${field.id}`);
            }
            if (field.validation.min !== undefined && field.validation.max !== undefined) {
                if (field.validation.min > field.validation.max) {
                    errors.push(`Min value cannot be greater than max value in field ${field.id}`);
                }
            }
        }

        if (field.validation.minLength !== undefined && field.validation.maxLength !== undefined) {
            if (field.validation.minLength > field.validation.maxLength) {
                errors.push(`MinLength cannot be greater than maxLength in field ${field.id}`);
            }
        }
    }

    return errors;
};

export const validateJson = (json: unknown): ValidationResult => {
    const errors: string[] = [];

    try {
        // Basic schema structure validation
        if (!json || typeof json !== 'object' || Array.isArray(json)) {
            errors.push('Schema must be an object');
            return { isValid: false, errors };
        }

        const schema = json as Partial<Schema>;

        if (!schema.formTitle || typeof schema.formTitle !== 'string') {
            errors.push('formTitle is required and must be a string');
        }

        if (!schema.formDescription || typeof schema.formDescription !== 'string') {
            errors.push('formDescription is required and must be a string');
        }

        if (!Array.isArray(schema.fields)) {
            errors.push('fields must be an array');
            return { isValid: false, errors };
        }

        // Validate each field
        schema.fields.forEach((field, index) => {
            errors.push(...validateField(field, index));
        });

        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };

    } catch (error) {
        return {
            isValid: false,
            errors: ['Invalid JSON format']
        };
    }
};

export default validateJson;