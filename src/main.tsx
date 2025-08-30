import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'wouter';
import './styles/theme.css';
import './styles/app.css';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Router><App/></Router></React.StrictMode>
);
