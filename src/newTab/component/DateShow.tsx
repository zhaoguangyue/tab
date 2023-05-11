import dayjs from 'dayjs';
import { useInterval, useFullscreen } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { Space, Button } from 'antd';
import { Lunar } from 'lunar-typescript';
import updateLocale from 'dayjs/plugin/updateLocale';
import MyCalendar from './Calendar';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
});

const DateShow = () => {
  const [time, setTime] = useState(dayjs());
  const [lunar, setLunar] = useState(Lunar.fromDate(new Date()));
  const calendar = useRef(null);

  const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(calendar, {
    pageFullscreen: true,
  });
  const onDoubleClick = () => {
    enterFullscreen();
  };

  useInterval(() => {
    setTime(dayjs());
    setLunar(Lunar.fromDate(new Date()));
  }, 1000);

  return (
    <div className="text-center mb-2" onDoubleClick={onDoubleClick}>
      <div className="text-6xl mb-1">{time.format('HH:mm')}</div>
      <Space className="text-sm">
        {time.format('M月DD日')}
        {time.format('dddd')}
        {`${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`}
      </Space>
      <div ref={calendar}>
        <div
          className={`${
            isFullscreen ? '' : 'hidden'
          } w-full h-full absolute bg-white flex flex-col`}
        >
          <div className="text-right py-2 px-4 bg-white">
            <Button onClick={exitFullscreen}>退出</Button>
          </div>
          <div className="flex-1 flex justify-center items-center bg-gray-50">
            <MyCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateShow;
