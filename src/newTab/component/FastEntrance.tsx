import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dropdown, Modal, Tabs, Tree, Form, Input, Avatar, Typography, type TabsProps } from 'antd';
import { useBoolean } from 'ahooks';
import { pluginId } from '../utils';
import { FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useFastEntrance } from '../dao/fastEntraceApi';
import { isEmpty, set } from 'lodash-es';

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const Icon = (props: any) => {
  let icon = null;
  if (props.data.children) {
    icon = <FolderOutlined />;
  } else {
    // @ts-ignore
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', props.url);
    url.searchParams.set('size', '64');
    icon = <img className="w-3 h-3" src={url.toString()} />;
  }
  return <div className="inline-flex items-center align-[-3px]">{icon}</div>;
};

const FastEntrance = () => {
  const { dataList, notionCreate, notionDelete, notionUpdate } = useFastEntrance();
  const [open, { toggle: toggleOpen }] = useBoolean(false);
  const [tab, setTab] = useState<string>('custom');
  const [newEntrance, setNewEntrance] = useState<any>({});
  const [newBookmarkEntrance, setNewBookmarkEntrance] = useState<any>({});
  const [form] = Form.useForm();
  // const isEdit = useMemo(() => !!newEntrance.id, []);

  let [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    // @ts-ignore
    chrome.bookmarks.getTree(function (res: any) {
      setBookmarks(res[0].children as any);
    });
  }, []);

  const treeNodeSelect = (keys: any, node: any) => {
    if (!node.node.children) {
      setNewBookmarkEntrance({
        id: newEntrance.id,
        Url: node.node.url,
        Icon: `chrome-extension://${pluginId}/_favicon/?pageUrl=${node.node.url || ''}&size=64`,
        Name: node.node.title,
      });
    }
  };

  const onValuesChange = useCallback(
    (val: any) => {
      setNewEntrance({
        ...newEntrance,
        ...val,
      });
    },
    [newEntrance]
  );

  const onFinish = useCallback(async () => {
    const doFinish = new Promise((resolve) => {
      if (tab === 'custom') {
        form.validateFields().then(() => {
          resolve(newEntrance);
        });
      } else if (!isEmpty(newBookmarkEntrance)) {
        resolve(newBookmarkEntrance);
      }
    });

    doFinish
      .then((data: any) => {
        if (data?.id) {
          notionUpdate(data);
        } else {
          notionCreate(data);
        }
      })
      .then(() => toggleOpen());
  }, [newEntrance, newBookmarkEntrance]);

  const onDelEntrance = useCallback((entrance: any) => {
    notionDelete(entrance.id);
  }, []);

  const onEditEntrance = useCallback((entrance: any) => {
    setNewEntrance(entrance);
    form.setFieldsValue(entrance);
    setTab('custom');
    toggleOpen();
  }, []);

  const onCancel = useCallback(() => {
    toggleOpen();
    setTab('custom');
    form.resetFields();
    console.log(newEntrance);
  }, [form]);

  const items: TabsProps['items'] = [
    {
      key: 'custom',
      label: '自定义',
      children: (
        <Form
          form={form}
          name="control-hooks"
          {...layout}
          layout="vertical"
          style={{ maxWidth: 600 }}
          onValuesChange={onValuesChange}
          labelCol={{ span: 24 }}
        >
          <Form.Item name="Name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Url" label="链接地址" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Icon" label="图标地址">
            <Input placeholder="请输入地址或文字" />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'bookmarks',
      label: '引用书签',
      children: (
        <Tree
          treeData={bookmarks}
          icon={Icon}
          showIcon
          defaultExpandAll
          height={450}
          virtual={false}
          fieldNames={{
            key: 'id',
          }}
          onSelect={treeNodeSelect}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="w-[500px] bg-white">
        <div className="p-2">
          {dataList.map((item: any) => (
            <Dropdown
              key={item.id}
              menu={{
                items: [
                  { key: 'edit', label: '编辑', onClick: () => onEditEntrance(item) },
                  {
                    key: 'del',
                    label: '删除',
                    onClick: () => onDelEntrance(item),
                  },
                ],
              }}
              trigger={['contextMenu']}
            >
              <a
                key={item.id}
                className="text-center no-underline relative inline-block w-[120px] h-[105px] rounded-lg p-2"
                href={item.Url}
              >
                <Avatar src={item.Icon || ''} alt={item.Name.slice(0, 4)} shape="square" size={60}>
                  {item.Icon.slice(0, 4)}
                </Avatar>
                <div className="overflow-hidden mt-1">
                  <Typography.Text ellipsis className="h-4 block align-top">
                    {item.Name}
                  </Typography.Text>
                </div>
              </a>
            </Dropdown>
          ))}
          <a className="w-[120px] h-[80px] p-2 rounded-lg inline-flex justify-center items-center align-top">
            <PlusOutlined className="text-6xl text-gray-500" onClick={toggleOpen} />
          </a>
        </div>
      </div>
      <Modal open={open} onCancel={onCancel} centered onOk={onFinish} zIndex={10000}>
        <div className="h-[450px] overflow-auto">
          <Tabs defaultActiveKey="custom" items={items} activeKey={tab} onTabClick={setTab}></Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default FastEntrance;
