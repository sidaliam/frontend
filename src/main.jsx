import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// AJOUTE ÇA
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1f2937',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '15px',
          maxWidth: '90%',
        },
        success: {
      
          style: { background: '#ecfdf5', color: '#166534' },
        },
        error: {
          icon: 'Error',
          style: { background: '#fef2f2', color: '#991b1b' },
        },
      }}
    />
  </React.StrictMode>
)