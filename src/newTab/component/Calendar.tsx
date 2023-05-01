import { useState } from 'react';
import { Badge, Calendar, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import { Solar, HolidayUtil } from 'lunar-typescript';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekdaysMin: ['日', '一', '二', '三', '四', '五', '六'],
});

const MyCalendar = () => {
  const cellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
    const year = current.year();
    const month = current.month() + 1;
    const day = current.date();
    const isToday = current.format('MM-DD') === dayjs().format('MM-DD');

    const h = HolidayUtil.getHoliday(year, month, day);
    const isWork = h?.isWork(); //是否调休
    const isDayOff = h && !isWork; //法定假日

    const d = Solar.fromYmd(year, month, day);
    const [holiday] = d.getFestivals();
    const lunar = d.getLunar();
    const lunarDay = lunar.getDayInChinese(); //农历
    const jieQi = lunar.getJieQi();

    return (
      <div className={`py-1 mx-1 rounded relative ${isToday ? 'bg-gray' : ''}`}>
        <div className="text-lg">{day}</div>
        <div className="text-xs scale-90">
          {holiday && <div className="text-blue whitespace-nowrap">{holiday}</div>}
          {jieQi && <div className="text-blue">{jieQi}</div>}
          {!holiday && !jieQi && lunarDay}
        </div>
        {isWork && <div className="absolute right-1 top-1 text-xs text-red scale-75">班</div>}
        {isDayOff && <div className="absolute right-1 top-1 text-xs text-green scale-75">休</div>}
      </div>
    );
  };

  return (
    <div className="my-calendar">
      <Calendar fullscreen={false} fullCellRender={cellRender} headerRender={() => null} />
    </div>
  );
};

export default MyCalendar;
