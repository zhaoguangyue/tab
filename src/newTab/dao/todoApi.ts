import { useState, useCallback, useEffect } from 'react';
import { useDebounceFn } from 'ahooks';
import { NotionApi } from './notion';
import { isToday } from '../utils';
import dayjs from 'dayjs';

const todoApi = new NotionApi('40035b2b387b4e8e896d0b10a2fdeca7', [
  { key: 'Name', type: 'title', defaultValue: '' },
  { key: 'Date', type: 'date', defaultValue: dayjs().format('YYYY-MM-DD') },
  { key: 'Todo', type: 'rich_text', defaultValue: dayjs().format('YYYY-MM-DD') },
]);

export interface DateItemProps {
  id: string;
  title: string;
  content: string;
  date: string | undefined;
}

export const useTodo = () => {
  const [dataList, setDataList] = useState<DateItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const notionGet = useCallback(async () => {
    setLoading(true);
    todoApi.query().then((data) => {
      const formatResult =
        data?.results?.map((item: any) => {
          return {
            id: item.id,
            title: item.properties.Name?.title?.[0]?.text?.content || '',
            content: item?.properties.Todo?.rich_text?.[0]?.text?.content || '',
            date: item.properties.Date?.date?.start,
          };
        }) || [];
      localStorage.setItem('todo', JSON.stringify(formatResult));
      setDataList(formatResult);
      setLoading(false);
    });
  }, []);

  const notionCreate = useCallback(async () => {
    todoApi.create({ Todo: '' }).then(() => notionGet());
  }, []);

  const notionDelete = useCallback(async (pageId: string) => {
    todoApi.delete({ pageId }).then(() => notionGet());
  }, []);

  const { run } = useDebounceFn(
    async (pageId: string, Todo: string) => {
      todoApi.update({ pageId, Todo });
    },
    { wait: 1500 }
  );

  const notionUpdate = useCallback(
    (pageId: string, content: string) => {
      const newDataList = dataList.map((item: DateItemProps) => {
        if (item.id === pageId) {
          return {
            ...item,
            content,
          };
        }
        return item;
      });
      setDataList(newDataList);
      run(pageId, content);
    },
    [dataList]
  );

  useEffect(() => {
    const cacheTodo = JSON.parse(localStorage.getItem('todo') || '[]');
    if (cacheTodo.length && isToday()) {
      setDataList(cacheTodo);
      setLoading(false);
      return;
    } else {
      notionGet();
    }
  }, []);

  return {
    dataList,
    loading,
    notionGet,
    notionCreate,
    notionUpdate,
    notionDelete,
  };
};
