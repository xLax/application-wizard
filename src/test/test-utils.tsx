import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationProvider } from '../context/ApplicationContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ApplicationProvider>
        {children}
      </ApplicationProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { initialRoute = '/', ...renderOptions } = options || {};
  
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }
  
  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
