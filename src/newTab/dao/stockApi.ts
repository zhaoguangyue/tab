import $ from 'jquery';
import { jsonp } from '../utils';

const market: { [key: number]: string } = {
  0: 'SZ',
  1: 'SH',
  116: 'HK',
  105: 'US',
};

export const getStock = (stockList: string[]): any => {
  return new Promise((resolve) => {
    $.ajax({
      url: `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f12,f13,f14,f17,f18,f221&secids=${stockList.join()}`,
      method: 'get',
      success: (data: any) => {
        const result = data.data?.diff
          ?.map((item: any) => ({
            name: item.f14,
            current: item.f2,
            fluctuationRate: item.f3,
            market: market[item.f13] || null,
            code: item.f12,
            fullCode: stockList.find((i) => i.includes(item.f12)),
            todayStart: item.f17,
            yesterdayEnd: item.f18,
            fluctuationRange: item.f4,
            lastUpdateTime: item.f221,
          }))
          .filter((item: any) => item.lastUpdateTime);
        resolve(result || []);
      },
    });
  });
};

export interface StockData {
  Name: string;
  Code: string;
  ID: string;
  QuoteID: string;
  SecurityType: string;
  SecurityTypeName: string;
}
export const searchStock = (val: string): any => {
  return new Promise((resolve) => {
    jsonp(
      `https://searchadapter.eastmoney.com/api/suggest/get?cb=cb&input=${val}&type=14&count=8`,
      (data: any) => {
        resolve((data?.QuotationCodeTable?.Data as StockData[]) || []);
      }
    );
  });
};

//
// https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f153&secids=0.002432,0.300750,0.300075

// f2	最新价
// f3	涨跌幅
// f4	涨跌额
// f5	总手
// f6	成交额
// f7	振幅
// f8	换手率
// f9	市盈率
// f10	量比
// f11	5分钟涨跌幅
// f12	股票代码
// f13	市场
// f14	股票名称
// f15	最高价
// f16	最低价
// f17	开盘价
// f18	昨收
// f20	总市值
// f21	流通市值
// f22	涨速
// f23	市净率
// f24	60日涨跌幅
// f25	年初至今涨跌幅
// f26	上市日期
// f28	昨日结算价
// f30	现手
// f31	买入价
// f32	卖出价
// f33	委比
// f34	外盘
// f35	内盘
// f36	人均持股数
// f37	净资产收益率(加权)
// f38	总股本
// f39	流通股
// f40	营业收入
// f41	营业收入同比
// f42	营业利润
// f43	投资收益
// f44	利润总额
// f45	净利润
// f46	净利润同比
// f47	未分配利润
// f48	每股未分配利润
// f49	毛利率
// f50	总资产
// f51	流动资产
// f52	固定资产
// f53	无形资产
// f54	总负债
// f55	流动负债
// f56	长期负债
// f57	资产负债比率
// f58	股东权益
// f59	股东权益比
// f60	公积金
// f61	每股公积金
// f62	主力净流入
// f63	集合竞价
// f64	超大单流入
// f65	超大单流出
// f66	超大单净额
// f69	超大单净占比
// f70	大单流入
// f71	大单流出
// f72	大单净额
// f75	大单净占比
// f76	中单流入
// f77	中单流出
// f78	中单净额
// f81	中单净占比
// f82	小单流入
// f83	小单流出
// f84	小单净额
// f87	小单净占比
// f88	当日DDX
// f89	当日DDY
// f90	当日DDZ
// f91	5日DDX
// f92	5日DDY
// f94	10日DDX
// f95	10日DDY
// f97	DDX飘红天数(连续)
// f98	DDX飘红天数(5日)
// f99	DDX飘红天数(10日)
// f100	行业
// f101	板块领涨股
// f102	地区板块
// f103	备注
// f104	上涨家数
// f105	下跌家数
// f106	平家家数
// f112	每股收益
// f113	每股净资产
// f114	市盈率（静）
// f115	市盈率（TTM）
// f124	当前交易时间
// f128	板块领涨股
// f129	净利润
// f130	市销率TTM
// f131	市现率TTM
// f132	总营业收入TTM
// f133	股息率
// f134	行业板块的成分股数
// f135	净资产
// f138	净利润TTM
// f221	更新日期
// f400	pre：盘前时间
// after：盘后时间
// period：盘中时间
