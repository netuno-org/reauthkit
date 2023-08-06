import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

import './main.css';

createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <Suspense fallback={""}>
        <Router>
          <App />
        </Router>
      </Suspense>
    </React.StrictMode>
  );
