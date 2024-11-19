import { test, expect } from '@playwright/test';

test.describe('Dynamic Form Generator', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the application', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Dynamic Form Generator');
    });

    test('should have both editor and preview sections', async ({ page }) => {
        await expect(page.locator('text=JSON Schema Editor')).toBeVisible();
        await expect(page.locator('text=Form Preview')).toBeVisible();
    });

    test('should validate form submission', async ({ page }) => {
        // Fill required fields
        await page.fill('input[placeholder="Enter your full name"]', 'John Doe');
        await page.fill('input[placeholder="you@example.com"]', 'john@example.com');
        await page.selectOption('select', '1-50');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for success state
        await expect(page.locator('text=Form submitted successfully')).toBeVisible();
    });

    test('should show validation errors', async ({ page }) => {
        // Submit without filling required fields
        await page.click('button[type="submit"]');

        // Check for error messages
        await expect(page.locator('text=This field is required')).toBeVisible();
    });

    test('should update form when JSON is edited', async ({ page }) => {
        // Get the Monaco editor
        const editor = page.locator('.monaco-editor');
        await expect(editor).toBeVisible();

        // New test field schema
        const newField = {
            id: "testField",
            type: "text",
            label: "Test Field",
            required: true,
            placeholder: "Test input"
        };

        // Update schema in editor
        await page.evaluate((field) => {
            const model = (window as any).monaco.editor.getModels()[0];
            const currentContent = JSON.parse(model.getValue());
            currentContent.fields.push(field);
            model.setValue(JSON.stringify(currentContent, null, 2));
        }, newField);

        // Check if new field appears in preview
        await expect(page.locator('text=Test Field')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
        // Fill invalid email
        await page.fill('input[placeholder="you@example.com"]', 'invalid-email');
        await page.click('button[type="submit"]');

        // Check for email validation error
        await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    });

    test('should support dark mode toggle', async ({ page }) => {
        // Click dark mode toggle (assuming we have one)
        await page.click('button[aria-label="Toggle dark mode"]');

        // Check if dark mode class is applied
        await expect(page.locator('html')).toHaveClass(/dark/);
    });
});