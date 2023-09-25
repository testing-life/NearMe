import React, { useEffect, useRef } from "react";
import { useUserMedia } from "../../Hooks/useUserMedia";

const TakePhoto = ({
  captureHandler,
}: {
  captureHandler: (data: File) => void;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mediaStream = useUserMedia({
    video: { facingMode: "environment" },
  });

  useEffect(() => {
    console.log("video", video, mediaStream);
    if (mediaStream && video.current && !video.current.srcObject) {
      video.current.srcObject = mediaStream;
      startCamera();
    }
  }, [mediaStream]);

  const startCamera = () => {
    console.log("mediaStream,video", mediaStream, video);
    video.current?.play();
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
          autoPlay
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
