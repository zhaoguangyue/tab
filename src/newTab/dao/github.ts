import dayjs from 'dayjs';
import { isToday } from '../utils';

// 通过 Personal Access Token 进行身份验证
// 设置请求头部信息
const headers = {
  Authorization: `Bearer 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`,
  Accept: 'application/vnd.github.v3+json',
};

// 获取用户所有仓库信息
export const getUserRepositories = async () => {
  try {
    const cacheRepo = JSON.parse(localStorage.getItem('repo') || '[]');
    let repositories = [];
    if (cacheRepo && isToday()) {
      repositories = cacheRepo;
    } else {
      const lastYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=100&sort=pushed&since=${lastYear}`,
        {
          method: 'GET',
          headers,
        }
      );
      repositories = await response.json();
      localStorage.setItem('repo', JSON.stringify(repositories));
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
