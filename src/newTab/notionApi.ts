import { useState, useCallback, useEffect } from 'react';
import { isDev, sendChromeMessage } from './utils';
import { useDebounceFn } from 'ahooks';
import { mockData } from './mockdata';

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

interface DateItemProps {
  id: string;
  title: string;
  content: string;
  date: string | undefined;
}

const InitDateItem = {
  id: '',
  title: '',
  content: '',
  date: '',
};

export const useNotionData = () => {
  const [dataList, setDataList] = useState<DateItemProps[]>([]);
  const [curData, setCurData] = useState<DateItemProps>(InitDateItem);
  const [loading, setLoading] = useState<boolean>(true);

  const notionGet = useCallback(async () => {
    if (isDev) {
      const formatResult = mockData.results.map((item: ItemProps) => {
        return {
          id: item.id,
          title: item.properties.Name.title[0]?.text.content ?? '',
          content: item?.properties.Todo.rich_text[0]?.text.content ?? '',
          date: item?.properties.Date.date?.start ?? '',
        };
      });
      setLoading(false);
      setDataList(formatResult);
      setCurData(formatResult[0]);
    } else {
      setLoading(true);
      sendChromeMessage({
        action: 'notion',
        operate: 'query',
      })
        .then((data: any) => {
          const formatResult = data.results.map((item: ItemProps) => {
            return {
              id: item.id,
              title: item.properties.Name.title[0]?.text.content,
              content: item?.properties.Todo.rich_text[0]?.text.content,
              date: item.properties.Date.date?.start,
            };
          });

          setDataList(formatResult);
          setCurData(formatResult[0]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const notionCreate = useCallback(async () => {
    sendChromeMessage({
      action: 'notion',
      operate: 'create',
      payload: {
        content: '',
      },
    }).then(() => notionGet());
  }, []);

  const { run } = useDebounceFn(
    async (pageId: string, title: string, content: string) => {
      sendChromeMessage({
        action: 'notion',
        operate: 'update',
        payload: {
          pageId,
          content,
        },
      });
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
    notionGet();
  }, []);

  return {
    dataList,
    curData,
    loading,
    setCurData,
    notionGet,
    notionCreate,
    notionUpdate,
  };
};
