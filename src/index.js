import React from 'react';
import App from './routes/App';
import { createRoot } from 'react-dom/client'

const refresh = () => window.location.reload(true)
createRoot(document.getElementById('app')).render(<App/>)
