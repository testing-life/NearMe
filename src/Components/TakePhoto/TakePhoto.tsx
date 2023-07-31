import React, { useEffect, useRef, useState } from "react";

const TakePhoto = ({
  captureHandler,
}: {
  captureHandler: (data: FormData) => void;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [dataUrl, setDataUrl] = useState("");
  const [imageBlob, setImageBlob] = useState<FormData>();

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
      await video.current?.play().catch((e) => console.error(e));
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
    canvas.current?.toBlob((blob) => {
      const formData = new FormData();
      formData.append("photo", blob as Blob, "le name");
      setImageBlob(formData);
      captureHandler(formData);
    });
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
