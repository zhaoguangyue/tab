import { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { useKeyPress, useBoolean } from 'ahooks';
import { Search } from '../../../newTab/component/Search';

const ContentSearch = () => {
  const [visible, { toggle, setTrue: setOpen, setFalse: setHidden }] = useBoolean(false);
  const [value, setValue] = useState('');
  const ref = useRef(null);

  useKeyPress(['meta.s'], (event) => {
    toggle();
    setValue('');
    event.preventDefault();
  });

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        ref.current.focus();
      });
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      closable={false}
      footer={null}
      mask={false}
      width={600}
      onCancel={setHidden}
      bodyStyle={{ padding: 0 }}
      wrapClassName="global-search-modal"
      style={{ top: '25%' }}
    >
      <Search isContentScript ref={ref} value={value} onChange={setValue} />
    </Modal>
  );
};

export default ContentSearch;
