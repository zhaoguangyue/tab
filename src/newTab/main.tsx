import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './root';
import 'antd/dist/reset.css';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
