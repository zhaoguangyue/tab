import { useState, useCallback, useEffect } from 'react';
import { fastEntranceApi } from './notion';
import dayjs from 'dayjs';

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
    setLoading(true);
    fastEntranceApi.query().then((data: any) => {
      const formatResult =
        data?.results?.map((item: ItemProps) => {
          return {
            id: item.id,
            name: item.properties.Name.title[0]?.text?.content || '',
            url: item?.properties.Url.url,
            icon: item.properties.Icon.rich_text?.[0]?.text?.content || '',
          };
        }) || [];
      localStorage.setItem(
        'fastEntrance',
        JSON.stringify({
          lastUpdateTime: dayjs().format('YYYY-MM-DD'),
          data: formatResult,
        })
      );
      setDataList(formatResult);
      setLoading(false);
    });
  }, []);

  const notionCreate = useCallback(async (...params: any) => {
    fastEntranceApi.create(params).then(() => notionGet());
  }, []);

  const notionDelete = useCallback(async (pageId: string) => {
    fastEntranceApi.delete({ pageId }).then(() => notionGet());
  }, []);

  const notionUpdate = useCallback(async (...params: any) => {
    fastEntranceApi.update(params).then(() => {
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
    });
  }, []);

  useEffect(() => {
    const cacheFastEntrance = JSON.parse(localStorage.getItem('fastEntrance') || '');
    if (cacheFastEntrance && cacheFastEntrance.lastUpdateTime === dayjs().format('YYYY-MM-DD')) {
      setDataList(cacheFastEntrance.data);
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
