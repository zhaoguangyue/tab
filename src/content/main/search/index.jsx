import { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { useKeyPress, useBoolean } from 'ahooks';
import { Search } from '../../../newTab/component/Search';

const ContentSearch = () => {
  const [visible, { toggle, setFalse: setHidden }] = useBoolean(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  useKeyPress(['meta.s'], (event) => {
    toggle();
    setOpen(true);
    setSearch('');
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
      <Search
        isContentScript
        ref={ref}
        search={search}
        open={open}
        onChangeOpen={setOpen}
        onChange={setSearch}
      />
    </Modal>
  );
};

export default ContentSearch;
