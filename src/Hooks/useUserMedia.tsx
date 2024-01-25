import { useState, useEffect } from "react";

interface Props {}

export const useUserMedia = (requestedMedia: object) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  const enableStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
      setMediaStream(stream as MediaStream);
    } catch (e) {
      console.error("user media error", e);
    }
  };

  const stopStream = async () => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const restartStream = () => {
    stopStream();
    enableStream();
  };

  useEffect(() => {
    if (!mediaStream) {
      enableStream();
    }
    return () => {
      stopStream();
    };
  }, [mediaStream, requestedMedia]);

  return { mediaStream, restartStream, stopStream };
};
