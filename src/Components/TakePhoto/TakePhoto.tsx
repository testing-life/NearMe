import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useUserMedia } from '../../Hooks/useUserMedia';
import { ReactComponent as Camera } from '../../Assets/Icons/camera.svg';
import './TakePhoto.css';

interface Props {
  captureHandler: (data: File | null) => void;
  uploadHandler: (e: ChangeEvent) => void;
  error: string;
  uploadProgress: number;
}

const TakePhoto: FC<Props> = ({
  captureHandler,
  uploadHandler,
  error,
  uploadProgress
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mediaStream = useUserMedia({
    video: { facingMode: 'environment' }
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
    const context = canvas.current!.getContext('2d');
    context!.drawImage(
      video.current!,
      0,
      0,
      canvas.current!.width,
      canvas.current!.height
    );
    canvas.current!.toBlob((blob) => {
      const formData = new FormData();
      formData.append('photoCapture', blob as Blob, `${Date.now()}-capture`);
      captureHandler(formData.get('photoCapture') as File);
    });
  };

  const clearCanvas = () => {
    const context = canvas.current!.getContext('2d');
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
      <div className='take-photo'>
        <div className='take-photo__video-container'>
          <video
            hidden={captured}
            className='take-photo__video'
            ref={video}
            autoPlay></video>
          <canvas
            hidden={!captured}
            className='w-100p'
            ref={canvas}
            height='430'
            width='600'
          />
        </div>
        <button className='u-basis-max-content' onClick={capture}>
          Capture
        </button>
        <button className='u-basis-max-content' onClick={clearCanvas}>
          Clear
        </button>
        <div>
          <label htmlFor='photoUpload' className='asLink'>
            Upload a photo
          </label>
          <input hidden id='photoUpload' type='file' onChange={uploadHandler} />
          {uploadProgress && uploadProgress !== 100 ? (
            <>
              {uploadProgress} <progress value={uploadProgress}></progress>
            </>
          ) : null}
          {error && <p className='-is-error'>{error}</p>}
        </div>
        <div className='take-photo__cta'>
          <Camera />
        </div>
      </div>
    </>
  );
};

export default TakePhoto;
