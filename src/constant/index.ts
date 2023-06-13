import browser from 'webextension-polyfill';

const google = browser.runtime.getURL('assets/google.svg');
const baidu = browser.runtime.getURL('assets/baidu.svg');
const github = browser.runtime.getURL('assets/github.svg');

// import google from '../assets/google.svg';
// import baidu from '../assets/baidu.svg';
// import github from '../assets/github.svg';

export enum Engine {
  Github = 'github',
  Baidu = 'baidu',
  Google = 'google',
}

export const githubRepo = ['ones-project-web', 'ones-ai-web-common', 'wiki-web'];

export const SearchEngine = [
  {
    engine: Engine.Github,
    icon: github,
  },
  {
    engine: Engine.Google,
    icon: google,
  },
  {
    engine: Engine.Baidu,
    icon: baidu,
  },
];
