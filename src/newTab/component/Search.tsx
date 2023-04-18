import { useState, useCallback, useEffect, useMemo } from 'react';
import { AutoComplete, Input, Avatar } from 'antd';
import { isEmpty } from 'lodash-es';

import { Engine, SearchEngine } from '../../constant';
import { sendChromeMessage } from '../utils';
import { githubRepo } from '../../constant';

export const Search = () => {
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [suggest, setSuggest] = useState<string[]>([]);
  const { engine, icon } = useMemo(() => SearchEngine[index], [index]);

  const changeSearchEngine = useCallback(() => {
    const nextIndex = index >= SearchEngine.length - 1 ? 0 : index + 1;
    setIndex(nextIndex);
  }, [index]);

  const onChangeSearch = useCallback((e: any) => {
    setSearch(e.target.value);
  }, []);

  const handleSearch = useCallback(async () => {
    if (isEmpty(search)) {
      return setSuggest([]);
    }

    let preSuggest: Array<string> = [];
    switch (engine) {
      case Engine.Github:
        preSuggest = githubRepo.filter((item) => item.includes(search));
        break;
      case Engine.Google:
      case Engine.Baidu:
        preSuggest = (await sendChromeMessage({
          action: 'search',
          engine,
          payload: search,
        })) as string[];
        break;
      default:
        preSuggest = [];
    }

    if (process.env.NODE_ENV === 'development') {
      preSuggest = [Math.random().toString(), Math.random().toString(), Math.random().toString()];
    }

    setSuggest(preSuggest);
  }, [search, engine]);

  useEffect(() => {
    handleSearch();
  }, [search, engine]);

  const onSearch = useCallback(() => {
    switch (engine) {
      case Engine.Google:
        window.location.href = `https://www.google.com/search?q=${search}&sourceid=chrome&ie=UTF-8`;
        break;
      case Engine.Baidu:
        window.location.href = `https://www.baidu.com/s?wd=${search}`;
        break;
      case Engine.Github:
        window.location.href = `https://github.com/BangWork/${search}`;
        break;
    }
  }, [engine, search]);

  const handleKeyUp = useCallback(
    (e: any) => {
      switch (e.key) {
        case 'Enter':
          onSearch();
          e.preventDefault();
          break;
        case 'Tab':
          changeSearchEngine();
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    [onSearch, changeSearchEngine]
  );

  return (
    <div className="w-full flex justify-center ">
      <div className="bg-slate-50 rounded-[30px] focus:shadow-sm">
        <AutoComplete
          className="w-[600px]"
          size="large"
          bordered={false}
          value={search}
          defaultOpen
          autoFocus
          onSelect={onSearch}
          options={suggest.map((item) => ({ value: item, label: item }))}
        >
          <Input
            className="w-[600px] h-[44px] focus:shadow-sm"
            size="large"
            placeholder={engine}
            onChange={onChangeSearch}
            onKeyDown={handleKeyUp}
            suffix={<Avatar src={icon} size="small" />}
          />
        </AutoComplete>
      </div>
    </div>
  );
};
