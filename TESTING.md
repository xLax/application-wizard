# Testing Guide for Application Wizard

This project uses **Vitest** and **React Testing Library** for unit testing.

## Setup

### Install Dependencies

```bash
npm install
```

This will install all required testing dependencies including:
- `vitest` - Fast unit test framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom jest matchers for DOM
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for tests
- `@vitest/ui` - Optional UI for test visualization

## Running Tests

### Run all tests (watch mode)
```bash
npm test
```

### Run tests once (CI mode)
```bash
npm test -- --run
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- src/components/common/FormField.test.tsx
```

### Run tests matching a pattern
```bash
npm test -- FormField
```

## Test Coverage

The following components have comprehensive unit tests:

### Common Components
- **ConfirmDialog.test.tsx** - Tests for confirmation dialog
  - Rendering behavior (open/closed states)
  - Button click handlers (Yes/No)
  - Overlay click behavior
  
- **FormField.test.tsx** - Tests for form input field
  - Input and textarea rendering
  - Error message display
  - Change handlers
  - Prop passing

- **RadioGroup.test.tsx** - Tests for radio button group
  - Default and custom options
  - Selection handling
  - Error display
  - Change handlers

### Step Components
- **Step1_PersonalInfo.test.tsx** - Personal information form
  - Form field rendering
  - Validation (email, phone, required fields)
  - Navigation to next step
  - Error clearing on input

- **Step2_WorkExperience.test.tsx** - Work experience form
  - Adding/removing experience blocks
  - Maximum limit (10 experiences)
  - Field validation
  - Current role checkbox behavior
  - Date validation

- **Step3_Questionnaire.test.tsx** - Questionnaire form
  - Radio button questions
  - File upload functionality
  - Validation for all questions
  - File type acceptance (PDF, DOCX)

- **Step4_Summary.test.tsx** - Application summary
  - Display of all entered data
  - Validation before submission
  - Navigation behavior
  - Error messages

- **Step5_ThankYou.test.tsx** - Thank you page
  - Success message display
  - Apply Again functionality
  - Icon rendering

### Layout Component
- **Layout.test.tsx** - Main application layout
  - Header and stepper rendering
  - Step highlighting (current/completed)
  - New Application button behavior
  - Confirmation dialog flow
  - Navigation handling

## Test Structure

Tests follow the Arrange-Act-Assert pattern:

```typescript
it('should do something', async () => {
  // Arrange - set up test data and render
  const user = userEvent.setup();
  render(<Component {...props} />);
  
  // Act - interact with the component
  await user.click(screen.getByRole('button'));
  
  // Assert - verify the outcome
  expect(mockFunction).toHaveBeenCalled();
});
```

## Testing Utilities

Custom test utilities are provided in `src/test/test-utils.tsx`:

- **Custom render function** - Wraps components with necessary providers (Router, ApplicationContext)
- **Initial route support** - Set initial route for testing navigation
- Re-exports all React Testing Library utilities

Example usage:
```typescript
import { render, screen } from '../../test/test-utils';

render(<MyComponent />, { initialRoute: '/work-experience' });
```

## Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **User-centric testing**: Test from the user's perspective
3. **Async operations**: Use `waitFor` for async state changes
4. **User interactions**: Use `userEvent` instead of `fireEvent`
5. **Mock sparingly**: Only mock external dependencies, not internals
6. **Descriptive test names**: Use "should..." pattern for clarity

## Troubleshooting

### Tests won't run
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (should be 18+)

### Import errors
- Make sure `vitest.config.ts` is properly configured
- Check that test setup file exists: `src/test/setup.ts`

### React Router errors
- Use the custom render from test-utils
- Ensure components using navigation are wrapped with providers

## Configuration Files

- **vitest.config.ts** - Vitest configuration
- **src/test/setup.ts** - Global test setup (cleanup, matchers)
- **src/test/test-utils.tsx** - Custom render with providers

## Writing New Tests

When adding new components, follow this template:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();
    
    render(<YourComponent onClick={mockHandler} />);
    await user.click(screen.getByRole('button'));
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

## Continuous Integration

For CI/CD pipelines, use:
```bash
npm test -- --run --reporter=verbose
```

This runs tests once and provides detailed output suitable for CI logs.
