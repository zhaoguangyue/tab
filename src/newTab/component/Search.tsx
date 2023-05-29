import { forwardRef, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AutoComplete, Input, Avatar } from 'antd';
import { isEmpty, isObject } from 'lodash-es';
import { useControllableValue, useDebounceFn } from 'ahooks';
import { Engine, SearchEngine } from '../../constant';
import { githubRepo } from '../../constant';
import { SearchFunc } from '../../background/search';
import { sendChromeMessage } from '../utils';
import { getUserRepositories } from '../dao/github';

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
    if (isEmpty(search) && engine !== Engine.Github) {
      return setSuggest([]);
    }

    switch (engine) {
      case Engine.Github:
        getUserRepositories().then((repoList) => {
          const gitSuggest = repoList.filter((item: any) => item.label.includes(search));
          setSuggest(gitSuggest);
        });
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

  const { run: onSearch } = useDebounceFn(
    (searchVal: string) => {
      let href = '';
      switch (engine) {
        case Engine.Google:
          href = `https://www.google.com/search?q=${searchVal}&sourceid=chrome&ie=UTF-8`;
          break;
        case Engine.Baidu:
          href = `https://www.baidu.com/s?wd=${searchVal}`;
          break;
        case Engine.Github:
          href = searchVal;
          break;
      }
      if (isContentScript) {
        window.open(href);
        return;
      } else {
        window.location.href = href;
      }
    },
    { wait: 0 }
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
    [search, onSearch, changeSearchEngine]
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
        options={suggest.map((item) => (isObject(item) ? item : { value: item, label: item }))}
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
