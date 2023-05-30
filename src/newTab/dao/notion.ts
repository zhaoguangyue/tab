import { Client } from '@notionhq/client';
import dayjs from 'dayjs';

const notion = new Client({
  auth: 'secret_TZ3uEvdTUsaqKgyPpRCz1eJfPbuR2HE2SyZw5YWxNuJ',
});

export type OperateType = 'query' | 'create' | 'update' | 'delete';

const propTypeMap: any = {
  title(content: string) {
    return {
      title: [{ text: { content } }],
    };
  },
  rich_text(content: string) {
    return {
      rich_text: [{ text: { content } }],
    };
  },
  date(start: string) {
    return {
      date: { start },
    };
  },
  url(url: string) {
    return {
      url,
    };
  },
};

interface DatabaseProps {
  key: string;
  type: string;
  defaultValue: string | any;
}
class NotionApi {
  database_id: string;
  databaseProps: DatabaseProps[];

  constructor(database_id: string, props: DatabaseProps[]) {
    this.database_id = database_id;
    this.databaseProps = props;
  }

  async query() {
    return await notion.databases.query({
      database_id: this.database_id,
    });
  }

  async delete(data: { pageId: string }) {
    const { pageId } = data;
    return await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
  }

  async create(params: any) {
    const properties = this.databaseProps.reduce((prev: any, item: DatabaseProps) => {
      const { key, type, defaultValue } = item;
      const val = params[key] || defaultValue;
      prev[key] = propTypeMap[type](val);
      return prev;
    }, {});

    return await notion.pages.create({
      parent: {
        database_id: this.database_id,
      },
      properties,
    });
  }

  async update(params: any) {
    const properties = this.databaseProps.reduce((prev: any, item: DatabaseProps) => {
      const { key, type } = item;
      if (Reflect.has(params, key)) {
        prev[key] = propTypeMap[type](params[key]);
      }
      return prev;
    }, {});
    return await notion.pages.update({
      page_id: params.pageId || params.id,
      properties,
    });
  }
}

export { NotionApi };
