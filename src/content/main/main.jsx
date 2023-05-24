import '../index.scss';
import React from 'react';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom';
import Search from './search';
import Remind from './remind';

const root = document.createElement('div');
root.id = 'tab-content-root';
document.body.append(root);

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider prefixCls="tab" iconPrefixCls="tabIcon">
      <Search />
      <Remind />
    </ConfigProvider>
  </React.StrictMode>,
  root
);
