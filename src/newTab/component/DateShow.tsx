import dayjs from 'dayjs';
import { useInterval } from 'ahooks';
import { useEffect, useState } from 'react';
import { Space } from 'antd';
import { Lunar } from 'lunar-typescript';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
});

const DateShow = () => {
  const [time, setTime] = useState(dayjs());
  const [lunar, setLunar] = useState(Lunar.fromDate(new Date()));
  useInterval(() => {
    setTime(dayjs());
    setLunar(Lunar.fromDate(new Date()));
  }, 1000);

  return (
    <div className="text-center mb-2">
      <div className="text-6xl mb-1">{time.format('HH:mm')}</div>
      <Space className="text-sm">
        {time.format('M月DD日')}
        {time.format('dddd')}
        {`${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`}
      </Space>
    </div>
  );
};

export default DateShow;
