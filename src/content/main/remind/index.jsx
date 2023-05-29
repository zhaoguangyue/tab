import { useEffect } from 'react';
import { notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const Remind = () => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.messageType !== 'remind') return;
      chrome.storage.sync.get(['remind']).then(({ remind: reminds = [] }) => {
        const remind = reminds.find((item) => item.key === request.name);
        if (remind) {
          notification.open({
            icon: <BellOutlined />,
            message: remind.title,
            description: remind.description,
            placement: 'topRight',
            duration: 0,
          });
        }
      });
    });
  }, []);

  return null;
};

export default Remind;
