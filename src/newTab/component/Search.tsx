import { forwardRef, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AutoComplete, Input, Avatar } from 'antd';
import { isEmpty } from 'lodash-es';
import { useControllableValue } from 'ahooks';
import { Engine, SearchEngine } from '../../constant';
import { githubRepo } from '../../constant';
import { SearchFunc } from '../../background/search';
import { sendChromeMessage } from '../utils';

interface SearchProps {
  isContentScript?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
export const Search = forwardRef((props: SearchProps, ref: any) => {
  const { isContentScript } = props;
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useControllableValue(props, { defaultValue: '' });
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

    switch (engine) {
      case Engine.Github:
        const gitSuggest = githubRepo.filter((item) => item.includes(search));
        setSuggest(gitSuggest);
        break;
      case Engine.Google:
      case Engine.Baidu:
        if (isContentScript) {
          const suggestForBackground: any = await sendChromeMessage({
            action: 'search',
            engine,
            payload: search,
          });
          setSuggest(suggestForBackground || []);
        } else {
          SearchFunc[engine](search).then((preSuggest) => {
            setSuggest(preSuggest);
          });
        }
        break;
      default:
    }
  }, [search, engine]);

  useEffect(() => {
    handleSearch();
  }, [search, engine]);

  const onSearch = useCallback(
    (searchVal: string) => {
      setSearch(searchVal);
      switch (engine) {
        case Engine.Google:
          window.location.href = `https://www.google.com/search?q=${searchVal}&sourceid=chrome&ie=UTF-8`;
          break;
        case Engine.Baidu:
          window.location.href = `https://www.baidu.com/s?wd=${searchVal}`;
          break;
        case Engine.Github:
          window.location.href = `https://github.com/BangWork/${searchVal}`;
          break;
      }
    },
    [engine]
  );

  const handleKeyUp = useCallback(
    (e: any) => {
      switch (e.key) {
        case 'Enter':
          onSearch(search);
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
    <div className="bg-slate-50 rounded-[30px] focus:shadow-sm">
      <AutoComplete
        className="w-full"
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
          autoFocus
          ref={ref}
          placeholder={engine}
          onChange={onChangeSearch}
          onKeyDown={handleKeyUp}
          suffix={<Avatar src={icon} size="small" />}
        />
      </AutoComplete>
    </div>
  );
});
