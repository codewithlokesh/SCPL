import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store,{ Persistor } from "./store/index.js";

const BASE_NAME = import.meta.env.VITE_BASE_NAME || "";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={BASE_NAME}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={Persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
) 
