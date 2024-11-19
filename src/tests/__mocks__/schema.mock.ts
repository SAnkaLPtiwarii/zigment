export const mockSchema = {
    formTitle: "Test Form",
    formDescription: "Test form description",
    fields: [
        {
            id: "name",
            type: "text",
            label: "Name",
            required: true,
            placeholder: "Enter name"
        },
        {
            id: "email",
            type: "email",
            label: "Email",
            required: true,
            placeholder: "Enter email",
            validation: {
                pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                message: "Invalid email format"
            }
        }
    ]
};