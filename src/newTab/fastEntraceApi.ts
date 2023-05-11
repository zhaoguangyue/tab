import { useState, useCallback, useEffect } from 'react';
import { isDev, sendChromeMessage } from './utils';
import { bookmarksNew } from './mockdata';

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
    Url: {
      url: string;
    };
    Icon: {
      rich_text: Array<{ text: { content: string } }>;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface DateItemProps {
  id: string;
  name: string;
  url: string;
  icon: string | undefined;
}

export const useFastEntrance = () => {
  const [dataList, setDataList] = useState<DateItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const notionGet = useCallback(async () => {
    if (isDev) {
      const formatResult = bookmarksNew;
      setLoading(false);
      setDataList(formatResult);
    } else {
      setLoading(true);
      sendChromeMessage(
        {
          action: 'fastEntrance',
          operate: 'query',
        },
        (data: any) => {
          const formatResult = data.results.map((item: ItemProps) => {
            return {
              id: item.id,
              name: item.properties.Name.title[0]?.text?.content || '',
              url: item?.properties.Url.url,
              icon: item.properties.Icon.rich_text?.[0]?.text?.content || '',
            };
          });

          setDataList(formatResult);
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, []);

  const notionCreate = useCallback(async (...params: any) => {
    sendChromeMessage(
      {
        action: 'fastEntrance',
        operate: 'create',
        payload: params,
      },
      () => notionGet()
    );
  }, []);

  const notionDelete = useCallback(async (pageId: string) => {
    sendChromeMessage(
      {
        action: 'fastEntrance',
        operate: 'delete',
        payload: {
          pageId,
        },
      },
      () => notionGet()
    );
  }, []);

  const notionUpdate = useCallback(async (...params: any) => {
    sendChromeMessage(
      {
        action: 'fastEntrance',
        operate: 'update',
        payload: params,
      },
      () => {
        const newDataList = dataList.map((item: DateItemProps) => {
          if (item.id === params.pageId) {
            return {
              ...item,
              ...params,
            };
          }
          return item;
        });
        setDataList(newDataList);
      }
    );
  }, []);

  useEffect(() => {
    notionGet();
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
