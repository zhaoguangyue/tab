import { Button } from 'antd';
// import { RecordRTC } from 'recordrtc';

const ScreenRecord = () => {
  const handleStart = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        let buffer = [];
        navigator.mediaDevices
          .getDisplayMedia({
            audio: true,
            video: {
              width: { ideal: 2560 },
              height: { ideal: 1440 },
            },
            preferCurrentTab: true,
          })
          .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'video/webm',
            });
            mediaRecorder.ondataavailable = (e) => {
              if (e && e.data && e.data.size > 0) {
                buffer.push(e.data);
              }
            };
            mediaRecorder.start();

            stream.oninactive = () => {
              mediaRecorder.stop();
              setTimeout(() => {
                var blob = new Blob(buffer, { type: 'video/webm' });
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');

                a.href = url;
                a.style.display = 'none';
                a.download = `${document.title}-${Date.now()}.webm`;
                a.click();
              });
            };
          })
          .catch((err) => {
            console.log(`录屏err--`, {
              code: err.code,
              name: err.name,
              message: err.message,
            });
            if (err.name === 'NotAllowedError') {
              if (err.message === 'Permission denied by system') {
                alert('mac设备需要有浏览器录制权限,设置-安全与隐私-屏幕录制');
              }
            } else {
              alert(
                `error: ${err.name} ${err.message} https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getDisplayMedia#%E5%BC%82%E5%B8%B8`
              );
            }
          });
      },
    });
  };

  return (
    <div>
      <Button onClick={handleStart}>开始录屏</Button>
    </div>
  );
};

export default ScreenRecord;
