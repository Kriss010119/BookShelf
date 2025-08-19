import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AuthProvider } from './context/auth-context'
import App from './App'
import { store } from './store/store.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)