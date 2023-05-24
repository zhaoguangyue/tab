import { Button } from 'antd';
import { useBoolean } from 'ahooks';
import RecordRTC from 'recordrtc';
import { useRef } from 'react';
/**
 * 1. 录屏
 * 2， 录屏后在新标签页打开，让用户主动去决定是否下载
 * 3. 支持标签页，支持窗口，支持全屏
 */
const ScreenRecord = () => {
  const [isRecording, { toggle }] = useBoolean(false);
  const recorder = useRef(null);

  const handleStart = async () => {
    toggle();
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    console.log('file: screenRecord.jsx:20 ~ handleStart ~ tab:', tab);
    // console.log('file: screenRecord.jsx:17 ~ handleStart ~ tab:', tab.id);

    // chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, async (id) => {
    //   console.log('file: screenRecord.jsx:40 ~ chrome.tabCapture.getMediaStreamId ~ id:', id);
    //   // chrome.tabs.create({
    //   //   active: false,
    //   // });
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   func: async () => {
    //     const stream = await navigator.mediaDevices.getDisplayMedia({
    //       audio: true,
    //       video: true,
    //     });
    //     recorder.current = new RecordRTC(stream, {
    //       type: 'video',
    //     });
    //     recorder.current.startRecording();
    //   },
    //   // files: ['../js/content.js'],
    // });

    // });
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: {
    //     mandatory: {
    //       chromeMediaSource: 'tab',
    //       chromeMediaSourceId: id,
    //     },
    //   },
    //   video: {
    //     mandatory: {
    //       chromeMediaSource: 'tab',
    //       chromeMediaSourceId: id,
    //     },
    //   },
    // });
    // recorder.current = new RecordRTC(stream, {
    //   type: 'video',
    // });
    // recorder.current.startRecording();

    // const stream = await navigator.mediaDevices.getDisplayMedia({
    //   audio: true,
    //   video: true,
    //   preferCurrentTab: false,
    // });
    // recorder.current = new RecordRTC(stream, {
    //   type: 'video',
    //   mineType: 'video/webm',
    // });
    // recorder.current.startRecording();

    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   func: async () => {
    //     const stream = await navigator.mediaDevices.getDisplayMedia({
    //       audio: true,
    //       video: true,
    //       preferCurrentTab: true,
    //     });
    //     recorder.current = new RecordRTC.GifRecorder(stream, {
    //       type: 'video',
    //     });
    //     recorder.current.startRecording();
    //   },
    //   // files: ['../js/content.js'],
    // });

    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
      preferCurrentTab: true,
    });
    recorder.current = new RecordRTC.GifRecorder(stream, {});
    // recorder.current.startRecording();
    recorder.current.record();

    setTimeout(() => {
      recorder.current.stop(function (blob) {
        // this.save('aaaa.webm');
        var img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        document.body.appendChild(img);

        // const aTag = document.createElement('a');
        // aTag.href = URL.createObjectURL(recorder.current.blob);
        // aTag.download = `${new Date()}.gif`;
        // document.body.appendChild(aTag);
        // aTag.click();
      });
    }, 2000);

    // stream.onended = () => {
    //   // Click on browser UI stop sharing button
    //   console.info('Recording has ended');
    // };

    // window.close();
  };
  const handleStop = () => {
    toggle();
    // recorder.current.stopRecording(function () {
    //   this.save('aaaa.webm');
    // });
    recorder.current.stop(function () {
      // this.save('aaaa.webm');
      var img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      document.body.appendChild(img);

      // const aTag = document.createElement('a');
      // aTag.href = URL.createObjectURL(recorder.current.blob);
      // aTag.download = `${new Date()}.gif`;
      // document.body.appendChild(aTag);
      // aTag.click();
    });
  };
  // getVideoTracks;
  // stream.getVideoTracks()[0].onended = function () {
  //   // doWhatYouNeedToDo();
  // };
  // stream.onended = () => {
  //   // Click on browser UI stop sharing button
  //   console.info('Recording has ended');
  // };

  // const onClick = async () => {
  //   const video = document.getElementById('video');
  //   const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
  //   console.log('file: App.tsx:15 ~ onClick ~ stream:', stream);
  //   video.srcObject = stream;
  //   const mediaRecorder = new MediaRecorder(stream);
  //   mediaRecorder.start();

  //   console.log('file: App.tsx:20 ~ onClick ~ video:', video);

  // const aTag = document.createElement('a');
  // aTag.href = video.src;
  // aTag.download = `${new Date()}.webm`;
  // document.body.appendChild(aTag);
  // aTag.click();

  //   console.log('file: App.tsx:21 ~ onClick ~ mediaRecorder:', mediaRecorder);
  // };

  return (
    <div>
      {!isRecording ? (
        <Button onClick={handleStart}>开始录制</Button>
      ) : (
        <Button onClick={handleStop}>结束录制</Button>
      )}
    </div>
  );
};

export default ScreenRecord;

// function invokeGetDisplayMedia(success, error) {
//     var displaymediastreamconstraints = {
//       video: {
//         displaySurface: 'monitor', // monitor, window, application, browser
//         logicalSurface: true,
//         cursor: 'always', // never, always, motion
//       },
//     };

//     // above constraints are NOT supported YET
//     // that's why overridnig them
//     displaymediastreamconstraints = {
//         video: true
//     };

//     if(navigator.mediaDevices.getDisplayMedia) {
//         navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
//     }
//     else {
//         navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
//     }
// }

// function captureScreen(callback) {
//     invokeGetDisplayMedia(function(screen) {
//         addStreamStopListener(screen, function() {
//             document.getElementById('btn-stop-recording').click();
//         });
//         callback(screen);
//     }, function(error) {
//         console.error(error);
//         alert('Unable to capture your screen. Please check console logs.\n' + error);
//     });
// }

// function stopRecordingCallback() {
//     video.src = video.srcObject = null;
//     video.src = URL.createObjectURL(recorder.getBlob());

//     recorder.screen.stop();
//     recorder.destroy();
//     recorder = null;

//     document.getElementById('btn-start-recording').disabled = false;
// }

// var recorder; // globally accessible

// document.getElementById('btn-start-recording').onclick = function() {
//     this.disabled = true;
//     captureScreen(function(screen) {
//         video.srcObject = screen;

//         recorder = RecordRTC(screen, {
//             type: 'video'
//         });

//         recorder.startRecording();

//         // release screen on stopRecording
//         recorder.screen = screen;

//         document.getElementById('btn-stop-recording').disabled = false;
//     });
// };

// document.getElementById('btn-stop-recording').onclick = function() {
//     this.disabled = true;
//     recorder.stopRecording(stopRecordingCallback);
// };

// function addStreamStopListener(stream, callback) {
//     stream.addEventListener('ended', function() {
//         callback();
//         callback = function() {};
//     }, false);
//     stream.addEventListener('inactive', function() {
//         callback();
//         callback = function() {};
//     }, false);
//     stream.getTracks().forEach(function(track) {
//         track.addEventListener('ended', function() {
//             callback();
//             callback = function() {};
//         }, false);
//         track.addEventListener('inactive', function() {
//             callback();
//             callback = function() {};
//         }, false);
//     });
// }
// // </script>
