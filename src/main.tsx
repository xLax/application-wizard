import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ApplicationProvider } from './context/ApplicationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApplicationProvider>
        <App />
      </ApplicationProvider>
    </BrowserRouter>
  </StrictMode>,
)
