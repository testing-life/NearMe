import React, { useEffect, useRef, useState } from "react";

const TakePhoto = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    startCamera();
  }, []);

  // const url = URL.createObjectURL(file);
  // this.videoElementRef.current.src = url;
  // await this.videoElementRef.current.play();
  // const mediaSream = this.videoElementRef.current.captureStream();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.current!.srcObject = stream;
      video.current?.play();
    } catch (error) {
      console.error("video error", error);
    }
  };

  const capture = () => {
    const context = canvas.current!.getContext("2d");
    context!.drawImage(
      video.current!,
      0,
      0,
      (canvas.current as any).width,
      (canvas.current as any).height
    );
    const data = canvas.current!.toDataURL("image/png");
    setDataUrl(data);
  };
  return (
    <div>
      <video ref={video} height="300" width="300">
        {/* <source src={stream} /> */}
      </video>
      <canvas ref={canvas} height="240" width="300" />
      {/* {dataUrl && <img src={dataUrl} alt="captured images" />} */}
      <button onClick={capture}>Capture</button>
    </div>
  );
};

export default TakePhoto;
