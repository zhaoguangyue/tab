import { useState, useCallback, useEffect } from 'react';
import { NotionApi } from './notion';
import { isToday } from '../utils';

const fastEntranceApi = new NotionApi('a3eea759937f484483837912f6662835', [
  { key: 'Name', type: 'title', defaultValue: '' },
  { key: 'Url', type: 'url', defaultValue: '' },
  { key: 'Icon', type: 'rich_text', defaultValue: '' },
]);

export interface DateItemProps {
  id: string;
  Name: string;
  Url: string;
  Icon: string | undefined;
}

export const useFastEntrance = () => {
  const [dataList, setDataList] = useState<DateItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const notionGet = useCallback(async () => {
    setLoading(true);
    fastEntranceApi.query().then((data: any) => {
      const formatResult =
        data?.results?.map((item: any) => {
          return {
            id: item.id,
            Name: item.properties.Name.title[0]?.text?.content || '',
            Url: item?.properties.Url.url,
            Icon: item.properties.Icon.rich_text?.[0]?.text?.content || '',
          };
        }) || [];
      localStorage.setItem('fastEntrance', JSON.stringify(formatResult));
      setDataList(formatResult);
      setLoading(false);
    });
  }, []);

  const notionCreate = useCallback(async (params: any) => {
    fastEntranceApi.create(params).then(() => notionGet());
  }, []);

  const notionDelete = useCallback(async (pageId: string) => {
    fastEntranceApi.delete({ pageId }).then(() => notionGet());
  }, []);

  const notionUpdate = useCallback(
    async (params: any) => {
      fastEntranceApi.update(params).then(() => {
        const newDataList = dataList.map((item: DateItemProps) => {
          if (item.id === params.id) {
            return {
              ...item,
              ...params,
            };
          }
          return item;
        });
        setDataList(newDataList);
      });
    },
    [dataList]
  );

  useEffect(() => {
    const cacheFastEntrance = JSON.parse(localStorage.getItem('fastEntrance') || '[]');
    if (cacheFastEntrance.length && isToday()) {
      setDataList(cacheFastEntrance);
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
