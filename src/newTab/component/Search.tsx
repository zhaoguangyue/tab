import { useState } from "react";
import { AutoComplete, Input, Avatar } from "antd";
import { isEmpty } from "lodash-es";
import google from "../../assets/google.svg";
import baidu from "../../assets/baidu.svg";
import { Engine } from "../../constant";
import { sendChromeMessage } from "../utils";

const SearchEngine = [
  {
    engine: Engine.Google,
    icon: google,
  },
  {
    engine: Engine.Baidu,
    icon: baidu,
  },
  // {
  //   engine: Engine.Github,
  //   icon: baidu,
  // },
];

export const Search = () => {
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const { engine, icon } = SearchEngine[index];
  const [suggest, setSuggest] = useState<string[]>([]);

  const changeSearchEngine = () => {
    const nextIndex = index >= SearchEngine.length - 1 ? 0 : index + 1;
    setIndex(nextIndex);
  };

  const onChangeSearch = async (e: any) => {
    setSearch(e.target.value);
    if (isEmpty(e.target.value)) {
      setSuggest([]);
    }

    if (process.env.NODE_ENV === "development") {
      setSuggest([
        Math.random().toString(),
        Math.random().toString(),
        Math.random().toString(),
      ]);
    } else {
      const suggestResponse = (await sendChromeMessage({
        action: "search",
        engine,
        payload: e.target.value,
      })) as string[];
      setSuggest(suggestResponse);
    }
  };
  const onSearch = (val: string) => {
    switch (engine) {
      case Engine.Google:
        window.location.href = `https://www.google.com/search?q=${val}&sourceid=chrome&ie=UTF-8`;
        break;
      case Engine.Baidu:
        window.location.href = `https://www.baidu.com/s?wd=${val}`;
        break;
    }
  };

  const handleKeyUp = (e: any) => {
    switch (e.key) {
      case "Enter":
        onSearch(search);
        e.preventDefault();
        break;
      case "Tab":
        changeSearchEngine();
        e.preventDefault();
        break;
      default:
        break;
    }
  };
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
