import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { MilkdownProvider } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import { Button, Divider, Descriptions, Collapse, Typography } from 'antd';
import { BarsOutlined, CalendarOutlined } from '@ant-design/icons';
import { useFavicon } from 'ahooks';

import favicon from '../assets/favicon.svg';
import { MilkdownEditor } from './component/Editor';
import { Search } from './component/Search';
import { useNotionData } from './notionApi';
import { getStock } from './stockApi';
import { Stock } from './component/Stock';
import MyCalendar from './component/Calendar';

const { Panel } = Collapse;

function App() {
  const { dataList, loading, notionCreate, notionUpdate } = useNotionData();
  const [activeKey, setActiveKey] = useState<string[] | string>([]);

  useFavicon(favicon);

  useEffect(() => {
    if (!loading) {
      const last = dataList[0];
      console.log('file: App.tsx:27 ~ useEffect ~ last:', last);
      setActiveKey([last.id]);
      var now = dayjs().format('YYYY-MM-DD');
      if (now !== last.date) {
        notionCreate();
      }
    }
  }, [loading]);

  return (
    <div className="App">
      <div className="p-[50px]">
        <Search />
      </div>
      <MyCalendar />
      <div className="px-[60px] py-[30px] flex flex-col overflow-auto flex-1">
        <div className="flex">
          <div>
            <div className="overflow-auto w-[500px]">
              <Collapse activeKey={activeKey} onChange={setActiveKey}>
                {dataList?.map((item) => (
                  <Panel header={item.title} key={item.id} showArrow={false}>
                    <div className="prose break-words cursor-pointer">
                      <MilkdownProvider>
                        <MilkdownEditor data={item} update={notionUpdate} />
                      </MilkdownProvider>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </div>
          <Stock />
        </div>
      </div>
    </div>
  );
}

export default App;
