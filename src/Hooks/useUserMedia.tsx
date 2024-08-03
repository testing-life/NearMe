import { useState, useEffect } from 'react';

export const useUserMedia = (requestedMedia: object) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  const enableStream = async () => {
    const stream = await navigator.mediaDevices
      .getUserMedia(requestedMedia)
      .catch((e) => console.error('user media error', e));
    if (stream) {
      setMediaStream(stream as MediaStream);
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
  }, [mediaStream, requestedMedia]);

  return { mediaStream, restartStream, stopStream, enableStream };
};
