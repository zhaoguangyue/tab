import { useCallback, useEffect, useState } from 'react';
import { MilkdownEditor } from './Editor';
import { MilkdownProvider } from '@milkdown/react';
import { useNotionData, type DateItemProps } from '../notionApi';
import dayjs from 'dayjs';
import { Button, Modal, Timeline } from 'antd';
import ReactMarkdown from 'react-markdown';

const Todo = () => {
  const { dataList, loading, notionCreate, notionUpdate, notionDelete } = useNotionData();
  const [openHistory, setOpenHistory] = useState(false);
  const [last, setLast] = useState<DateItemProps>();
  useEffect(() => {
    if (!loading) {
      const last = dataList[0] || {};
      setLast(last);
      var now = dayjs().format('YYYY-MM-DD');
      console.log(
        'file: Todo.tsx:19 ~ useEffect ~ now !== last.date:',
        now,
        last,
        now !== last.date
      );
      if (now !== last.date) {
        notionCreate();
      }
    }
  }, [loading]);

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
