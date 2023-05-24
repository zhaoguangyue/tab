import { useState } from 'react';
import { Tabs } from 'antd';
import './index.scss';
import ScreenRecord from './components/screenRecord';

const tabs = [
  {
    label: '录屏',
    key: 'screenRecord',
    children: <ScreenRecord />,
  },
];
function App() {
  return (
    <div className="w-[300px] h-[500px] px-3">
      <Tabs items={tabs}></Tabs>
    </div>
  );
}

export default App;
