import { useCallback, useEffect, useState } from 'react';
import { MilkdownEditor } from './Editor';
import { MilkdownProvider } from '@milkdown/react';
import { useTodo, type DateItemProps } from '../dao/todoApi';
import { Button, Modal, Timeline } from 'antd';
import ReactMarkdown from 'react-markdown';
import { isToday } from '../utils';

const Todo = () => {
  const { dataList, loading, notionCreate, notionUpdate, notionDelete } = useTodo();
  const [openHistory, setOpenHistory] = useState(false);
  const [last, setLast] = useState<DateItemProps>();
  useEffect(() => {
    if (!loading) {
      const last: any = dataList[0] || {};
      setLast(last);
      if (last?.date && !isToday(last?.date)) {
        notionCreate();
      }
    }
  }, [dataList, loading]);

  const viewHistory = useCallback(() => {
    setOpenHistory(true);
  }, []);

  return (
    <div className="p-4 bg-white w-[500px] prose break-words">
      <div className="prose break-words">
        <div className="text-xl mb-2 pb-1 border-b flex justify-between">
          <div>{last?.date}</div>
          <Button onClick={viewHistory} className="text-base" type="ghost">
            查看历史
          </Button>
        </div>
        {last && (
          <MilkdownProvider>
            <MilkdownEditor data={last} update={notionUpdate} />
          </MilkdownProvider>
        )}
        <Modal
          title="历史记录"
          open={openHistory}
          width={500}
          zIndex={10000}
          centered
          footer={null}
          onCancel={() => setOpenHistory(false)}
        >
          <div className="h-[500px] overflow-auto py-2">
            <Timeline
              mode="left"
              items={dataList.map((item) => ({
                children: (
                  <div key={item.id}>
                    <div className="text-gray-600">{item.title}</div>
                    <div className="prose break-words text-sm">
                      <ReactMarkdown>{item.content || '暂无'}</ReactMarkdown>
                    </div>
                  </div>
                ),
              }))}
            ></Timeline>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Todo;
