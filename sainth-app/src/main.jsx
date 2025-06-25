import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SAINTH from './SAINTH.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SAINTH />
  </StrictMode>,
)
