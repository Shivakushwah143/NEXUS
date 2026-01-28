import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { loadStripe } from '@stripe/stripe-js';
import App from './App'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import { BlogProvider } from './context/BlogContext'
import { Elements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
createRoot(document.getElementById('root')!).render(



  <Elements stripe={stripePromise}>

    <BlogProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </BlogProvider>
  </Elements>
)
