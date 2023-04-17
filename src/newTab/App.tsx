import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Card,
  Space,
  Collapse,
  Input,
  Calendar,
  Typography,
  Segmented,
} from "antd";
import { BarsOutlined, CalendarOutlined } from "@ant-design/icons";
import { sendChromeMessage } from "./utils";
import { MilkdownEditor } from "./component/Editor";
import { Search } from "./component/Search";
import dayjs from "dayjs";

import ReactMarkdown from "react-markdown";

import { MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import { useNotionData } from "./notionApi";

const { Panel } = Collapse;

function App() {
  const { dataList, curData, loading, setCurData, notionCreate, notionUpdate } =
    useNotionData();
  const [activeKey, setActiveKey] = useState<string[] | string>([]);
  console.log("file: App.tsx:31 ~ App ~ activeKey:", activeKey);

  const [chartStyle, setChartStyle] = useState<string>("list");

  const handleChangeStyle = useCallback((value: any) => {
    setChartStyle(value);
  }, []);

  const dateCellRender = (current: any) => {
    const today = dayjs(current).format("YYYY-MM-DD");
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
    console.log("file: App.tsx:58 ~ useEffect ~ loading:", loading);
    if (!loading) {
      setActiveKey([curData.id]);
    }
  }, [loading]);

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
                value: "list",
                icon: <BarsOutlined />,
              },
              {
                value: "calendar",
                icon: <CalendarOutlined />,
              },
            ]}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {chartStyle === "calendar" && (
            <Calendar cellRender={dateCellRender} headerRender={() => null} />
          )}
          {chartStyle === "list" && (
            <div className="flex h-full w-full">
              <div className="overflow-auto w-[300px]">
                <Collapse activeKey={activeKey} onChange={setActiveKey}>
                  {dataList?.map((item) => (
                    <Panel header={item.title} key={item.id} showArrow={false}>
                      <div
                        className="prose break-words cursor-pointer"
                        onClick={() => setCurData(item)}
                      >
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                      </div>
                    </Panel>
                    // <Card
                    //   title={item.title}
                    //   key={item.id}
                    //   onClick={}
                    // >
                    //   <ReactMarkdown>{item.content}</ReactMarkdown>
                    //   {/* <p>{item?.properties.Todo.rich_text[0]?.text.content}</p> */}
                    // </Card>
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
