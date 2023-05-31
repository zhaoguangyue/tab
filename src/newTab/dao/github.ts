import dayjs from 'dayjs';
import { isToday } from '../utils';
import { NotionApi } from './notion';
import Browser from 'webextension-polyfill';

const githubApi = new NotionApi('e553f53876b84946b9c4cff579291740', []);

const getGithubToken = () => {
  return githubApi.query().then((data: any) => {
    const token = data?.results?.[0]?.properties?.token?.rich_text?.[0]?.text?.content || '';
    Browser.storage.sync.set({ githubToken: token });
    return token;
  });
};

// 获取用户所有仓库信息
export const getUserRepositories = async () => {
  try {
    let { githubToken } = await Browser.storage.sync.get('githubToken');
    if (!githubToken) {
      githubToken = await getGithubToken();
    }
    const cacheRepo = JSON.parse(localStorage.getItem('repo') || '{}');
    let repositories = [];
    if (cacheRepo.data?.length && isToday(cacheRepo.lastUpdate)) {
      repositories = cacheRepo.data;
    } else {
      const lastYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=100&sort=pushed&since=${lastYear}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${githubToken}`, // 通过 Personal Access Token 进行身份验证
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      repositories = await response.json();
      localStorage.setItem(
        'repo',
        JSON.stringify({
          lastUpdate: dayjs().format('YYYY-MM-DD'),
          data: Array.isArray(repositories) ? repositories : [],
        })
      );
    }

    // 处理仓库信息
    return repositories.map((repo: any) => ({
      label: repo.name,
      value: repo.html_url,
    }));
  } catch (error) {
    console.error(error);
  }
};
