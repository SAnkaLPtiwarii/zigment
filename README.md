# Dynamic Form Generator

A React TypeScript application that generates forms dynamically from JSON schemas with real-time preview and validation.

## Features

- Real-time JSON schema editing with syntax highlighting
- Dynamic form generation with live preview
- Form validation using Zod
- Dark/Light mode support
- Export form submissions as JSON
- Responsive design
- Type-safe implementation
- Comprehensive test coverage

## Tech Stack

- React 18+
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod Validation
- Monaco Editor
- Jest & Playwright for testing

## Installation

bash
# Clone repository
git clone https://github.com/SAnkaLPtiwarii/zigment.git
cd dynamic-form-generator

# Install dependencies
npm install

# Start development server
npm run dev


## Usage

1. Edit JSON schema in left panel
2. Preview generated form in right panel
3. Submit form to see validation
4. Download submissions as JSON

Example Schema:
json
{
  "formTitle": "Project Requirements Survey",
  "formDescription": "Please fill out this survey about your project needs",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    }
  ]
}


## Available Scripts

bash
npm run dev         # Start development server
npm run build      # Build for production
npm test          # Run unit tests
npm run test:e2e  # Run end-to-end tests
npm run lint      # Run ESLint
npm run format    # Format code with Prettier


## Project Structure


src/
├── components/      # React components
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── types/          # TypeScript types
├── tests/          # Test files
└── constants/      # Constant values


## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## Testing

bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage


## License

MIT License

## Author
SANKALP TIWARI


