import { useState, useCallback, useEffect } from 'react';
import { useDebounceFn } from 'ahooks';
import { todoApi } from '../../background/notion';
import { isToday } from '../utils';

interface ItemProps {
  id: string;
  properties: {
    Name: {
      title: Array<{
        text: {
          content: string;
        };
      }>;
    };
    Todo: {
      rich_text: Array<{
        text: {
          content: string;
        };
      }>;
    };
    Date: {
      date: {
        start: string;
      } | null;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

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
    todoApi.create({ content: '' }).then(() => notionGet());
  }, []);

  const notionDelete = useCallback(async (pageId: string) => {
    todoApi.delete({ pageId }).then(() => notionGet());
  }, []);

  const { run } = useDebounceFn(
    async (pageId: string, title: string, content: string) => {
      todoApi.update({ pageId, content });
    },
    { wait: 1500 }
  );

  const notionUpdate = useCallback(
    (pageId: string, title: string, content: string) => {
      const newDataList = dataList.map((item: DateItemProps) => {
        if (item.id === pageId) {
          return {
            ...item,
            title,
            content,
          };
        }
        return item;
      });
      setDataList(newDataList);
      run(pageId, title, content);
    },
    [dataList]
  );

  useEffect(() => {
    const cacheTodo = JSON.parse(localStorage.getItem('todo') || '[]');
    if (cacheTodo && isToday()) {
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
