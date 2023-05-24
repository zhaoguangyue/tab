import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { AutoComplete, Row, Col, Table, Dropdown } from 'antd';
import { MenuOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUpdateEffect, useBoolean, useInterval } from 'ahooks';
import { getStock, searchStock, type StockData } from '../dao/stockApi';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';

const getColor = (val: number) => (val > 0 ? 'text-red' : val < 0 ? 'text-green' : '');
let stockList: string[] = JSON.parse(localStorage.getItem('stockList') || '[]');

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

export const Stock = () => {
  const [value, setValue] = useState('');
  const [suggest, setSuggest] = useState<StockData[]>([]);
  const [stockData, setStockData] = useState<any[][]>([]);
  const [edit, { toggle: toggleEdit }] = useBoolean(false);

  const columns = useMemo(() => {
    let _columns: any = [
      {
        title: '股票名称',
        dataIndex: 'name',
        width: 140,
        render: (text: string, record: any) => {
          const href =
            record.market && record.lastUpdateTime
              ? `https://www.futunn.com/stock/${record.code}-${record.market}`
              : `http://quote.eastmoney.com/unify/r/${record.fullCode}`;
          return (
            <div className="cursor-pointer" onClick={() => window.open(href)}>
              {text}
            </div>
          );
        },
      },
      {
        title: '最新价',
        dataIndex: 'current',
        width: 80,
        render: (text: number, record: any) => (
          <span className={getColor(record.fluctuationRate)}>{text}</span>
        ),
      },
      {
        title: '今开',
        dataIndex: 'todayStart',
        width: 80,
        render: (text: number, record: any) => (
          <span className={getColor(record.fluctuationRate)}>{text}</span>
        ),
      },
      { title: '昨收', dataIndex: 'yesterdayEnd' },
      {
        title: '涨跌幅',
        width: 90,
        dataIndex: 'fluctuationRate',
        render: (text: number) => <span className={getColor(text)}>{text}%</span>,
      },
    ];

    if (edit) {
      _columns.unshift({
        key: 'sort',
      });
      _columns.push({
        key: 'delete',
      });
    }

    return _columns;
  }, [edit]);

  const onSearch = useCallback((val: string) => {
    setValue(val);
  }, []);
  const onSelect = useCallback((val: string) => {
    setValue('');
    stockList.push(val);
    localStorage.setItem('stockList', JSON.stringify(stockList));
    getStockData();
  }, []);

  useUpdateEffect(() => {
    searchStock(value).then((res: StockData[]) => {
      setSuggest(res);
    });
  }, [value]);

  const getStockData = useCallback(() => {
    if ((dayjs().hour() > 9 && dayjs().hour() < 16) || !stockData.length) {
      getStock(stockList).then((res: any[][]) => {
        setStockData(res);
      });
    }
  }, [stockList, stockData]);

  const deleteStock = useCallback((code: string) => {
    stockList = stockList.filter((item) => !item.includes(code));
    localStorage.setItem('stockList', JSON.stringify(stockList));
    getStockData();
  }, []);

  useInterval(getStockData, 5000);

  useEffect(() => {
    getStockData();
  }, []);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setStockData((previous) => {
        const activeIndex = previous.findIndex((i: any) => i.code === active.id);
        const overIndex = previous.findIndex((i: any) => i.code === over?.id);
        const newSort = arrayMove(previous, activeIndex, overIndex);
        localStorage.setItem('stockList', JSON.stringify(newSort.map((i: any) => i.fullCode)));
        return newSort;
      });
    }
  };

  const RowRenderer = ({ children, ...props }: RowProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
        /translate3d\(([^,]+),/,
        'translate3d(0,'
      ),
      transition,
      ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes} key={props['data-row-key']}>
        {React.Children.map(children, (child) => {
          if ((child as React.ReactElement).key === 'sort' && edit) {
            return React.cloneElement(child as React.ReactElement, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ touchAction: 'none', cursor: 'move', fontSize: 12 }}
                  {...listeners}
                />
              ),
            });
          } else if ((child as React.ReactElement).key === 'delete' && edit) {
            return React.cloneElement(child as React.ReactElement, {
              children: (
                <DeleteOutlined
                  style={{ touchAction: 'none', cursor: 'pointer', fontSize: 12 }}
                  onClick={() => deleteStock(props['data-row-key'])}
                />
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };

  return (
    <div>
      <Dropdown
        menu={{
          items: [
            { key: 'startEdit', label: !edit ? '设置' : '完成设置', onClick: () => toggleEdit() },
          ],
        }}
        trigger={['contextMenu']}
      >
        <div className="p-4 bg-white w-[500px]">
          {edit && (
            <AutoComplete
              className="w-full"
              value={value}
              onSearch={onSearch}
              options={suggest.map((item) => ({
                value: item.QuoteID,
                label: (
                  <Row className="flex justify-between">
                    <Col span={6}>{item.Code}</Col>
                    <Col span={13} className="truncate">
                      {item.Name}
                    </Col>
                    <Col span={3}>{item.SecurityTypeName}</Col>
                  </Row>
                ),
              }))}
              onSelect={onSelect}
            ></AutoComplete>
          )}
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext
              items={stockData.map((i: any) => i.code)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                size="small"
                className="stock-table"
                pagination={false}
                components={{
                  body: {
                    row: RowRenderer,
                  },
                }}
                rowKey="code"
                columns={columns}
                dataSource={stockData}
              />
            </SortableContext>
          </DndContext>
        </div>
      </Dropdown>
    </div>
  );
};
