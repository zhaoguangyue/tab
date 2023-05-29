import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Modal,
  Form,
  Table,
  Typography,
  Radio,
  DatePicker,
  TimePicker,
  Input,
  InputNumber,
  Button,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { sendChromeMessage } from '../utils';

declare global {
  interface Window {
    chrome: any;
  }
}
interface Item {
  key: string;
  title: string;
  description: string;
  type: string;
  time: any;
  interval: string;
}

const EditRemind = (props: any) => {
  const { visible, data, onCancel, onOk } = props;
  const [form] = Form.useForm();
  const remindType = Form.useWatch('type', form);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      form.setFieldValue('time', dayjs(data.time));
    } else {
      form.setFieldValue('type', 'repeat');
    }
  }, [data, visible]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [onCancel]);

  const onSave = useCallback(() => {
    form
      .validateFields()
      .then((row: Item) => {
        const newVal = row;
        newVal.key = data?.key || Math.random().toString().slice(2);
        newVal.time = newVal.time.valueOf();
        onOk(newVal);
        handleCancel();
      })
      .catch((errInfo) => {
        console.log('Validate Failed:', errInfo);
      });
  }, [handleCancel, onOk, data]);

  return (
    <Modal
      zIndex={1001}
      centered
      maskClosable={false}
      open={visible}
      onCancel={handleCancel}
      onOk={onSave}
    >
      <Form form={form} layout="vertical" colon>
        <Form.Item name="title" label="提醒标题">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="提醒描述">
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name="type" label="提醒方式">
          <Radio.Group defaultValue="repeat">
            <Radio value="repeat">重复提醒</Radio>
            <Radio value="once">单次提醒</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="time" label="设置提醒时间">
          {remindType !== 'once' ? (
            <TimePicker format="HH:mm:ss" />
          ) : (
            <DatePicker showToday={false} format="YYYY-MM-DD HH:mm:ss" showNow={false} showTime />
          )}
        </Form.Item>
        {remindType !== 'once' && (
          <Form.Item name="interval" label="提醒间隔/小时">
            <InputNumber />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
const Remind = () => {
  const [visible, setVisible] = useState(false);
  const [editRemind, setEditRemind] = useState(false);
  const [editData, setEditData] = useState<Item>();
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    window.chrome.storage.sync.get('remind').then((res: any) => {
      setData(res.remind || []);
    });
  }, []);

  const onEdit = useCallback((record: Item) => {
    setEditRemind(true);
    setEditData(record);
  }, []);

  const onDelete = useCallback(
    (key: React.Key) => {
      const newDate = data.filter((item: Item) => key !== item.key);
      setData(newDate);
      window.chrome.storage.sync.set({ remind: newDate });
    },
    [data]
  );

  const columns = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'title',
        width: '15%',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '25%',
      },
      {
        title: '方式',
        dataIndex: 'type',
        width: '15%',
        render: (val: string) => (val === 'once' ? '单次提醒' : '重复提醒'),
      },
      {
        title: '时间',
        dataIndex: 'time',
        width: '20%',
        render: (_: any, record: Item) => {
          if (record.type === 'once') {
            return dayjs(record.time).format('YYYY-MM-DD HH:mm:ss');
          } else {
            return dayjs(record.time).format('HH:mm:ss');
          }
        },
      },
      {
        title: '间隔',
        dataIndex: 'interval',
        width: '10%',
        render: (val: string) => (val ? `${val}小时` : '---'),
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        render: (_: any, record: Item) => {
          return (
            <Space>
              <Typography.Link onClick={() => onEdit(record)}>编辑</Typography.Link>
              <Typography.Link type="danger" onClick={() => onDelete(record.key)}>
                删除
              </Typography.Link>
            </Space>
          );
        },
      },
    ],
    [onDelete, onEdit]
  );

  const onCancel = useCallback(() => {
    setEditRemind(false);
  }, []);

  const onOk = useCallback(
    (row: Item) => {
      const newData = data;
      const curItem: Item | undefined = newData.find((item: Item) => row.key === item.key);
      if (curItem) {
        Object.assign(curItem, row);
      } else {
        newData.push(row);
      }
      setData([...newData]);
      window.chrome.storage.sync.set({ remind: newData });
      sendChromeMessage({
        action: 'refreshRemind',
      });
    },
    [data]
  );

  return (
    <div>
      <Button onClick={() => setVisible(true)}>按钮</Button>
      <Button onClick={() => setEditRemind(true)}>添加</Button>
      <Modal
        open={visible}
        title="提醒管理"
        centered
        width={1000}
        onCancel={() => setVisible(false)}
        footer={null}
        maskClosable={false}
        zIndex={1000}
      >
        <Table
          rowKey="key"
          bordered
          dataSource={data}
          columns={columns}
          pagination={{
            defaultPageSize: 5,
          }}
        />
      </Modal>
      <EditRemind visible={editRemind} data={editData} onCancel={onCancel} onOk={onOk} />
    </div>
  );
};
export default Remind;
