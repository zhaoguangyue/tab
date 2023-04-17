import { ConfigProvider } from "antd";
import App from "./App";

function Root() {
  return (
    <ConfigProvider>
      <App />
    </ConfigProvider>
  );
}

export default Root;
