// src/types/schema.ts
export interface FieldOption {
    value: string;
    label: string;
}

export interface ValidationRule {
    pattern?: string;
    message?: string;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
}

export type FieldType = 'text' | 'email' | 'select' | 'radio' | 'textarea' | 'number' | 'checkbox';

export interface Field {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: FieldOption[];
    validation?: ValidationRule;
    defaultValue?: string | number | boolean;
    description?: string;
}

export interface Schema {
    formTitle: string;
    formDescription: string;
    fields: Field[];
}

