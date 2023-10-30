import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Config from './common/Config';
import App from './App';

import './main.css';

const reauthkitScript = document.createElement("script");
reauthkitScript.src = `/reauthkit.js?time=${new Date().getTime()}`;
reauthkitScript.onload = () => {
  Config.init();
  createRoot(document.getElementById('root'))
    .render(
      <Suspense fallback={""}>
        <Router>
          <App />
        </Router>
      </Suspense>
    );
};
document.body.appendChild(reauthkitScript);