import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import '@milkdown/theme-nord/style.css';
import { Button, Divider, Descriptions, Collapse, Typography } from 'antd';
import { useFavicon } from 'ahooks';
import favicon from '../assets/favicon.svg';
import { MilkdownEditor } from './component/Editor';
import { Search } from './component/Search';
import { useNotionData } from './notionApi';
import { getStock } from './stockApi';
import { Stock } from './component/Stock';
import MyCalendar from './component/Calendar';
import Todo from './component/Todo';
import FastEntrance from './component/FastEntrance';

const { Panel } = Collapse;

function App() {
  useFavicon(favicon);

  return (
    <div className="App">
      <div className="p-[50px]">
        <Search />
      </div>
      <div className="px-[60px] py-[30px] flex flex-col overflow-auto flex-1">
        <div className="flex justify-between">
          <Todo />
          <div>
            <div className="mb-4">
              <FastEntrance />
            </div>
            <div>
              <Stock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
