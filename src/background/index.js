import dayjs from 'dayjs';
import browser from 'webextension-polyfill';
import { SearchFunc } from './search';

async function sendMessageToActiveTab(alarm) {
  console.log('file: index.js:6 ~ sendMessageToActiveTab ~ alarm:', alarm);
  const iconUrl = browser.runtime.getURL('assets/alarm.png');
  browser.storage.sync.get(['remind']).then(({ remind: reminds = [] }) => {
    const remind = reminds.find((item) => item.key === alarm.name);
    if (remind) {
      browser.notifications.create(alarm.name, {
        type: 'basic',
        iconUrl,
        title: remind.title,
        message: remind.description,
        requireInteraction: true,
      });
    }
  });
}

const createAlarms = (reminds) => {
  reminds.forEach((item) => {
    if (item.type !== 'once') {
      const YMD = dayjs().format('YYYY-MM-DD');
      const HMS = dayjs(item.time).format('HH:mm:ss');
      const when = dayjs(`${YMD} ${HMS}`).valueOf();
      browser.alarms.create(item.key, {
        when,
        periodInMinutes: item.interval * 60,
      });
    } else {
      browser.alarms.create(item.key, {
        when: item.time,
      });
    }
  });
};

// 初始化提醒
const initAlarms = () => {
  browser.alarms.clearAll();
  browser.storage.sync.get(['remind']).then((res) => {
    createAlarms(res?.remind || []);
  });
};
initAlarms();
browser.alarms.onAlarm.addListener(sendMessageToActiveTab);

// @ts-ignore
browser.runtime.onMessage.addListener(async (request) => {
  const { action, payload, engine } = request;
  if (action === 'search') {
    const res = await SearchFunc[engine](payload);
    return res;
  }
  if (action === 'refreshRemind') {
    initAlarms();
  }
  return null;
});
