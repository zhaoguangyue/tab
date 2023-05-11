import { Client } from '@notionhq/client';
import dayjs from 'dayjs';

const notion = new Client({
  auth: 'secret_TZ3uEvdTUsaqKgyPpRCz1eJfPbuR2HE2SyZw5YWxNuJ',
});

export type OperateType = 'query' | 'create' | 'update' | 'delete';

class NotionApi {
  database_id: string;

  constructor(database_id: string) {
    this.database_id = database_id;
  }

  async query() {
    console.log(this);
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
}

class TodoApi extends NotionApi {
  constructor(database_id: string) {
    super(database_id);
  }

  async create({ content }: { content: string }) {
    return await notion.pages.create({
      parent: {
        database_id: this.database_id,
      },
      properties: {
        Date: {
          date: {
            start: dayjs().format('YYYY-MM-DD'),
          },
        },
        Name: {
          title: [
            {
              text: { content: dayjs().format('YYYY-MM-DD') },
            },
          ],
        },
        Todo: {
          rich_text: [
            {
              text: { content },
            },
          ],
        },
      },
    });
  }

  async update(data: { pageId: string; content: string }) {
    const { pageId, content } = data;
    return await notion.pages.update({
      page_id: pageId,
      properties: {
        Todo: {
          rich_text: [
            {
              text: { content },
            },
          ],
        },
      },
    });
  }
}
class FastEntranceApi extends NotionApi {
  constructor(database_id: string) {
    super(database_id);
  }

  async create({ name, url, icon }: { name: string; url: string; icon: string }) {
    return await notion.pages.create({
      parent: {
        database_id: this.database_id,
      },
      properties: {
        Name: {
          title: [
            {
              text: { content: name },
            },
          ],
        },
        Url: {
          url,
        },
        Icon: {
          rich_text: [
            {
              text: { content: icon },
            },
          ],
        },
      },
    });
  }

  async update(data: { pageId: string; name: string; url: string; icon: string }) {
    const { pageId, name, url, icon } = data;
    return await notion.pages.update({
      page_id: pageId,
      properties: {
        Name: {
          title: [
            {
              text: { content: name },
            },
          ],
        },
        Url: {
          url,
        },
        Icon: {
          rich_text: [
            {
              text: { content: icon },
            },
          ],
        },
      },
    });
  }
}

const todoApi = new TodoApi('40035b2b387b4e8e896d0b10a2fdeca7');
const fastEntranceApi = new FastEntranceApi('a3eea759937f484483837912f6662835');

export { todoApi, fastEntranceApi };
