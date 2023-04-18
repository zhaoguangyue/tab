import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import { MilkdownProvider } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import { Button, Divider, Space, Collapse, Calendar, Typography, Segmented } from 'antd';
import { BarsOutlined, CalendarOutlined } from '@ant-design/icons';
import { useFavicon } from 'ahooks';

import favicon from '../assets/favicon.svg';
import { MilkdownEditor } from './component/Editor';
import { Search } from './component/Search';
import { useNotionData } from './notionApi';

const { Panel } = Collapse;

function App() {
  const { dataList, curData, loading, setCurData, notionCreate, notionUpdate } = useNotionData();
  const [activeKey, setActiveKey] = useState<string[] | string>([]);

  const [chartStyle, setChartStyle] = useState<string>('list');

  const handleChangeStyle = useCallback((value: any) => {
    setChartStyle(value);
  }, []);

  const dateCellRender = (current: any) => {
    const today = dayjs(current).format('YYYY-MM-DD');
    const date = dataList.find((item) => {
      return today === item.date;
    });
    const val = date?.content;
    return (
      <Typography.Paragraph
        ellipsis={{
          rows: 3,
        }}
      >
        {val}
      </Typography.Paragraph>
    );
  };

  useEffect(() => {
    if (!loading) {
      setActiveKey([curData.id]);
    }
  }, [loading]);

  useFavicon(favicon);

  return (
    <div className="App">
      <div className="p-[60px]">
        <Search />
      </div>
      <Divider className="m-0" />
      <div className="px-[60px] py-[30px] flex flex-col overflow-auto flex-1">
        <div className="flex justify-between mb-4">
          <div>
            <Button onClick={notionCreate}>新增</Button>
          </div>
          <Segmented
            onChange={handleChangeStyle}
            value={chartStyle}
            options={[
              {
                value: 'list',
                icon: <BarsOutlined />,
              },
              {
                value: 'calendar',
                icon: <CalendarOutlined />,
              },
            ]}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {chartStyle === 'calendar' && (
            <Calendar cellRender={dateCellRender} headerRender={() => null} />
          )}
          {chartStyle === 'list' && (
            <div className="flex h-full w-full">
              <div className="overflow-auto w-[300px]">
                <Collapse activeKey={activeKey} onChange={setActiveKey}>
                  {dataList?.map((item) => (
                    <Panel header={item.title} key={item.id} showArrow={false}>
                      <div
                        className="prose break-words cursor-pointer"
                        onClick={() => setCurData(item)}
                      >
                        <ReactMarkdown>{item.content || '暂无'}</ReactMarkdown>
                      </div>
                    </Panel>
                  ))}
                </Collapse>
                <Space direction="vertical"></Space>
              </div>
              <MilkdownProvider>
                <MilkdownEditor data={curData} update={notionUpdate} />
              </MilkdownProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
