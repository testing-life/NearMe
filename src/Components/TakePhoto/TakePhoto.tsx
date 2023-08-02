import React, { useEffect, useRef } from "react";

const TakePhoto = ({
  captureHandler,
}: {
  captureHandler: (data: File) => void;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: {
            width: {
              min: 1280,
              ideal: 1920,
              max: 2560,
            },
            height: {
              min: 720,
              ideal: 1080,
              max: 1440,
            },
            facingMode: "environment",
          },
        })
        .catch((e: Error) => console.error(e.message));
      (video.current as any)!.srcObject = stream;
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
      canvas.current!.width,
      canvas.current!.height
    );
    canvas.current!.toBlob((blob) => {
      const formData = new FormData();
      formData.append("photoCapture", blob as Blob, `${Date.now()}-capture`);
      captureHandler(formData.get("photoCapture") as File);
    });
  };
  return (
    <>
      <div className="u-flex">
        <video
          className="u-flex-grow-1"
          ref={video}
          height="300"
          width="300"
        ></video>
        <canvas
          className="u-flex-grow-1"
          ref={canvas}
          height="600"
          width="600"
        />
      </div>
      <button className="u-basis-max-content" onClick={capture}>
        Capture
      </button>
    </>
  );
};

export default TakePhoto;
