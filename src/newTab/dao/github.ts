import dayjs from 'dayjs';

// 通过 Personal Access Token 进行身份验证
// 设置请求头部信息
const headers = {
  Authorization: `Bearer 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`,
  Accept: 'application/vnd.github.v3+json',
};

// 获取用户所有仓库信息
export const getUserRepositories = async () => {
  try {
    const lastYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=100&sort=pushed&since=${lastYear}`,
      {
        method: 'GET',
        headers,
      }
    );
    const repositories = await response.json();
    // 处理仓库信息
    return repositories.map((repo: any) => ({
      label: repo.name,
      value: repo.html_url,
    }));
  } catch (error) {
    console.error(error);
  }
};
