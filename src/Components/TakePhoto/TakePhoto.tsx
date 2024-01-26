import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useUserMedia } from '../../Hooks/useUserMedia';
import { ReactComponent as Camera } from '../../Assets/Icons/camera.svg';
import { ReactComponent as PlusCircle } from '../../Assets/Icons/add-circle.svg';
import './TakePhoto.css';
import Button from '../Button/Button';

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
  const { mediaStream, stopStream } = useUserMedia({
    video: { facingMode: 'environment' }
  });
  const [captured, setCaptured] = useState(false);
  const [showFeed, setShowFeed] = useState(false);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const getFeed = async () => {
    if (mediaStream && video.current) {
      video.current.srcObject = mediaStream;
      setShowFeed(true);
    }
  };

  const stopFeed = () => {
    if (mediaStream && video.current) {
      video.current.srcObject = null;
      setShowFeed(false);
    }
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
          <button className='take-photo__cta' onClick={getFeed}>
            <Camera />
            <PlusCircle className='take-photo__cta-secondary-icon' />
          </button>
        </div>
        <div className='take-photo__video-feed' hidden={!showFeed}>
          <video
            className='take-photo__video'
            ref={video}
            autoPlay
            muted></video>
          <Button variant='highlight' fullWidth clickHandler={capture}>
            Capture
          </Button>
          <Button variant='text' fullWidth clickHandler={stopFeed}>
            Cancel
          </Button>
        </div>
        <div className='take-photo__photos' hidden={!captured}>
          <canvas
            // hidden={!captured}
            ref={canvas}
            height='430'
            width='600'
          />
        </div>
        {/* <div className="take-photo__video-container">
          <video
            hidden={captured}
            className="take-photo__video"
            ref={video}
            autoPlay
          ></video>
  
        </div> */}
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
      </div>
    </>
  );
};

export default TakePhoto;
