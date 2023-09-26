import React, { useEffect, useRef, useState } from "react";
import { useUserMedia } from "../../Hooks/useUserMedia";

const TakePhoto = ({
  captureHandler,
}: {
  captureHandler: (data: File | null) => void;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mediaStream = useUserMedia({
    video: { facingMode: "environment" },
  });
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (mediaStream && video.current && !video.current.srcObject) {
      video.current.srcObject = mediaStream;
      startCamera();
    }
  }, [mediaStream]);

  const startCamera = () => {
    video.current?.play();
  };

  const capture = () => {
    setCaptured(true);
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

  const clearCanvas = () => {
    const context = canvas.current!.getContext("2d");
    context!.drawImage(
      video.current!,
      0,
      0,
      canvas.current!.width,
      canvas.current!.height
    );
    captureHandler(null);
    setCaptured(false);
  };

  return (
    <>
      <div>
        <video className="" ref={video} autoPlay></video>
        <button className="u-basis-max-content" onClick={capture}>
          Capture
        </button>
        <button className="u-basis-max-content" onClick={clearCanvas}>
          Clear
        </button>
        <canvas
          hidden={!captured}
          className="w-100p"
          ref={canvas}
          height="430"
          width="600"
        />
      </div>
    </>
  );
};

export default TakePhoto;
