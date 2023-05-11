import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Dropdown,
  Modal,
  Tabs,
  Tree,
  Form,
  Input,
  Upload,
  Image,
  Avatar,
  Badge,
  Space,
  Typography,
  type TabsProps,
} from 'antd';
import { useBoolean, useClickAway } from 'ahooks';
import { bookmarks as mockData } from '../mockdata';
import { isDev, pluginId } from '../utils';
import { mock } from 'node:test';
import { FolderOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useFastEntrance } from '../fastEntraceApi';
import { fastEntranceApi } from '../../background/notion';
import { isEmpty, find } from 'lodash-es';

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const FastEntrance = () => {
  const { dataList, notionCreate, notionDelete, notionUpdate } = useFastEntrance();
  const [open, { toggle: toggleOpen }] = useBoolean(false);
  const [tab, setTab] = useState<string>('custom');
  const [newEntrance, setNewEntrance] = useState<any>({});
  const [newBookmarkEntrance, setNewBookmarkEntrance] = useState<any>({});
  const [form] = Form.useForm();

  let [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    if (isDev) {
      setBookmarks(mockData[0].children);
    } else {
      // @ts-ignore
      chrome.bookmarks.getTree(function (res: any) {
        setBookmarks(res[0].children as any);
      });
    }
  }, []);

  const Icon = (props: any) => {
    let icon = null;
    if (props.data.children) {
      icon = <FolderOutlined />;
    } else {
      icon = (
        <img
          className="w-3 h-3"
          src={`chrome-extension://${pluginId}/_favicon/?pageUrl=${props.url || ''}&size=64`}
        />
      );
    }
    return <div className="inline-flex items-center align-[-3px]">{icon}</div>;
  };

  const treeNodeSelect = (keys: any, node: any) => {
    if (!node.node.children) {
      setNewBookmarkEntrance({
        url: node.node.url,
        icon: `chrome-extension://${pluginId}/_favicon/?pageUrl=${node.node.url || ''}&size=64`,
        name: node.node.title,
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
    toggleOpen();
  }, []);

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
        >
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ required: true }]}>
            <Input />
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
        <div className="flex">
          {dataList.map((item: any) => (
            <Dropdown
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
                className="m-3 text-center no-underline relative bg-gray-50 p-2 block w-[120px] h-[100px] rounded-lg"
                href={item.url}
              >
                <Avatar
                  src={item.icon || `https://www.google.com/s2/favicons?domain=${item.url}&sz=96`}
                  alt={item.name.slice(0, 4)}
                  shape="circle"
                  size={60}
                />
                <div className="max-w-[90px] overflow-hidden">
                  <Typography.Text ellipsis className="h-4 block align-top">
                    {item.name}
                  </Typography.Text>
                </div>
              </a>
            </Dropdown>
          ))}
          <div className="m-3 bg-gray-50 w-[120px] h-[100px] rounded-lg flex justify-center items-center">
            <PlusOutlined className="text-6xl text-gray-500" onClick={toggleOpen} />
          </div>
        </div>
      </div>
      <Modal open={open} onCancel={toggleOpen} centered onOk={onFinish} zIndex={10000}>
        <div className="h-[450px] overflow-auto">
          <Tabs defaultActiveKey="custom" items={items} activeKey={tab} onTabClick={setTab}></Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default FastEntrance;
