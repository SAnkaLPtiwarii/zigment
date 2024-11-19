// src/components/FormPreview/FormPreview.tsx
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema } from "@/types/schema";
import { generateValidationSchema } from "@/utils/formGenerator";
import { Button } from "../ui/Button/Button";
import { Input } from "../ui/Input/Input";
import { Select } from "../ui/Select/Select";
import { TextArea } from "../ui/TextArea/TextArea";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FormPreviewProps {
    schema: Schema;
    onSubmit: (data: any) => void;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const FormPreview = ({ schema, onSubmit }: FormPreviewProps) => {
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const [submitResponse, setSubmitResponse] = useState<string>('');

    const validationSchema = generateValidationSchema(schema);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(validationSchema),
    });

    const handleFormSubmit = async (data: any) => {
        try {
            setFormStatus('submitting');
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSubmit(data);
            setFormStatus('success');
            setSubmitResponse('Form submitted successfully!');
            setTimeout(() => {
                reset();
                setFormStatus('idle');
                setSubmitResponse('');
            }, 2000);
        } catch (error) {
            setFormStatus('error');
            setSubmitResponse('An error occurred while submitting the form.');
            setTimeout(() => {
                setFormStatus('idle');
                setSubmitResponse('');
            }, 3000);
        }
    };

    const renderField = (field: Schema["fields"][0]) => {
        const commonProps = {
            ...register(field.id),
            placeholder: field.placeholder,
            required: field.required,
            "aria-invalid": errors[field.id] ? true : false,
        };

        switch (field.type) {
            case "textarea":
                return <TextArea {...commonProps} />;
            case "select":
                return <Select options={field.options ?? []} {...commonProps} />;
            case "radio":
                return (
                    <div className="flex gap-4">
                        {field.options?.map((option) => (
                            <label key={option.value} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value={option.value}
                                    {...register(field.id)}
                                    className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                                />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                );
            default:
                return <Input type={field.type} {...commonProps} />;
        }
    };
    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">{schema.formTitle}</h1>
                <p className="text-muted-foreground">{schema.formDescription}</p>
            </div>

            {schema.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {field.label}
                        {field.required && <span className="text-destructive"> *</span>}
                    </label>
                    {renderField(field)}
                    {errors[field.id] && (
                        <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {(errors[field.id]?.message as string) || "This field is required"}
                        </p>
                    )}
                </div>
            ))}

            {submitResponse && (
                <div className={`flex items-center gap-2 rounded-lg p-4 text-sm ${formStatus === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                    {formStatus === 'success' ? (
                        <CheckCircle2 className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    {submitResponse}
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="min-w-[120px]"
                >
                    {formStatus === 'submitting' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting
                        </>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default FormPreview;