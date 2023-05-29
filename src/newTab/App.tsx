import { useFavicon } from 'ahooks';
import favicon from '../assets/favicon.svg';
import { Search } from './component/Search';
import { Stock } from './component/Stock';
import Todo from './component/Todo';
import FastEntrance from './component/FastEntrance';
import Remind from './component/Remind';
import DateShow from './component/DateShow';
import { getUserRepositories } from './dao/github';

function App() {
  useFavicon(favicon);
  getUserRepositories();

  return (
    <div className="App">
      <div className="p-[50px]">
        <div className="w-full flex justify-center items-center flex-col">
          <div>
            <DateShow />
          </div>
          <div className="w-[600px]">
            <Search />
          </div>
        </div>
      </div>
      <div className="px-[60px] py-[30px] flex flex-col overflow-auto flex-1">
        <div className="flex justify-between">
          <Todo />
          <div>
            <div className="mb-4">
              <FastEntrance />
            </div>
            <div>
              <Stock />
            </div>
          </div>
        </div>
      </div>
      <Remind />
    </div>
  );
}

export default App;
