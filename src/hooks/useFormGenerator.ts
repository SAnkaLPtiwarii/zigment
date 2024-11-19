// src/hooks/useFormGenerator.ts
import { useCallback, useState } from 'react';
import { Schema } from '@/types/schema';
import validateJson from '@/utils/jsonValidator';

export const useFormGenerator = (initialSchema: Schema) => {
    const [schema, setSchema] = useState<Schema>(initialSchema);
    const [isValid, setIsValid] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    const updateSchema = useCallback((newSchema: unknown) => {
        const validation = validateJson(newSchema);
        setIsValid(validation.isValid);
        setErrors(validation.errors || []);
        if (validation.isValid && newSchema as Schema) {
            setSchema(newSchema as Schema);
        }
    }, []);

    return {
        schema,
        isValid,
        errors,
        updateSchema,
    };
};