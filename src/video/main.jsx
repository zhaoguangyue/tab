import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
// import './index.scss';
// import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      {/* <App /> */}
      <div>123</div>
    </ConfigProvider>
  </React.StrictMode>
);
