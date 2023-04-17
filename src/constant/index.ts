import google from "../assets/google.svg";
import baidu from "../assets/baidu.svg";
import github from "../assets/github.svg";

export enum Engine {
  Baidu = "baidu",
  Google = "google",
  Github = "github",
}

export const githubRepo = [
  "ones-project-web",
  "ones-ai-web-common",
  "wiki-web",
];

export const SearchEngine = [
  {
    engine: Engine.Google,
    icon: google,
  },
  {
    engine: Engine.Baidu,
    icon: baidu,
  },
  {
    engine: Engine.Github,
    icon: github,
  },
];
