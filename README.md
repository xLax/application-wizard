# Application Wizard

A multi-step application form built with React, TypeScript, and Vite. Features include form validation, local storage persistence, and a comprehensive testing suite.

## Features

- 📝 Multi-step form with progress tracking
- ✅ Form validation using Zod
- 💾 Local storage persistence
- 🎨 Clean, modern UI with CSS modules
- 🧪 Comprehensive unit tests with Vitest
- 🔄 React Router for navigation
- 📱 Responsive design

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zod** - Schema validation
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Testing

This project includes comprehensive unit tests for all components.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

For detailed testing documentation, see [TESTING.md](./TESTING.md)

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── ConfirmDialog.tsx
│   │   ├── FormField.tsx
│   │   └── RadioGroup.tsx
│   ├── Layout/          # App layout
│   │   └── Layout.tsx
│   └── Steps/           # Form steps
│       ├── Step1_PersonalInfo.tsx
│       ├── Step2_WorkExperience.tsx
│       ├── Step3_Questionnaire.tsx
│       ├── Step4_Summary.tsx
│       └── Step5_ThankYou.tsx
├── context/             # React Context
│   └── ApplicationContext.tsx
├── schemas/             # Validation schemas
│   └── validation.ts
├── types/               # TypeScript types
│   └── index.ts
├── test/                # Test utilities
│   ├── setup.ts
│   └── test-utils.tsx
├── App.tsx
└── main.tsx
```

## Form Steps

1. **Personal Information** - Name, email, phone, location, social links
2. **Work Experience** - Add up to 10 work experiences with details
3. **Questionnaire** - Answer questions and upload CV (PDF/DOCX)
4. **Summary** - Review all entered information
5. **Thank You** - Confirmation page

## Validation Rules

### Personal Info
- Full Name: minimum 2 characters
- Email: valid email format
- Phone: only + and numbers, 8-12 characters
- City & Country: required
- LinkedIn/GitHub URLs: optional, must be valid URLs

### Work Experience
- All fields required except End Date (if current role)
- Description: minimum 10 characters
- Start date cannot be in future
- End date cannot be before start date

### Questionnaire
- All questions must be answered
- CV file required (PDF or DOCX only)

## Features in Detail

### Local Storage Persistence
All form data is automatically saved to local storage as you progress through the steps. Your data persists even if you refresh the page.

**Note:** File uploads cannot be persisted and will need to be re-uploaded after a page refresh.

### Form Navigation
- Progress through steps using Next/Back buttons
- Visual stepper shows current progress
- Cannot skip steps - must complete in order
- New Application button to start over (with confirmation)

### Validation
- Real-time validation feedback
- Inline error messages
- Global validation on step navigation
- Schema-based validation using Zod

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
