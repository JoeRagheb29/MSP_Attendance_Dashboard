import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-ignore: optional CSS file may be absent or has no type declarations
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
