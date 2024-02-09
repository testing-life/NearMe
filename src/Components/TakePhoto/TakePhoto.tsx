import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useUserMedia } from '../../Hooks/useUserMedia';
import { ReactComponent as Camera } from '../../Assets/Icons/camera.svg';
import { ReactComponent as PlusCircle } from '../../Assets/Icons/add-circle.svg';
import { ReactComponent as RemoveCircle } from '../../Assets/Icons/remove-circle.svg';
import './TakePhoto.css';
import Button from '../Button/Button';

interface Props {
  captureHandler: (data: File | null) => void;
  uploadHandler?: (e: ChangeEvent) => void;
  error: string;
  uploadProgress: number;
}

const TakePhoto: FC<Props> = ({
  captureHandler,
  uploadHandler,
  error,
  uploadProgress
}) => {
  const preview = useRef<HTMLImageElement>(null);
  const [captured, setCaptured] = useState(false);

  const capture = (e: ChangeEvent<HTMLInputElement>) => {
    setCaptured(true);
    const file = e?.target?.files?.[0];
    const reader = new FileReader();
    try {
      if (file) {
        reader.onload = () => {
          const dataUrl = reader.result;
          preview.current!.src = (dataUrl as string) || '';
        };
        reader.readAsDataURL(file);
        // captureHandler(file);
      }
    } catch (error) {
      throw new Error('Error with acquiring the image');
    }
  };

  const clearCanvas = () => {
    captureHandler(null);
    setCaptured(false);
  };

  return (
    <>
      <div className='take-photo'>
        {!captured && (
          <div className='take-photo__video-container'>
            <label htmlFor='photoUpload'>
              <div className='take-photo__cta'>
                <Camera />
                <PlusCircle className='take-photo__cta-secondary-icon' />
              </div>
              <p className='take-photo__desc'>Tap to take a photo</p>
            </label>{' '}
            {/* <input hidden id='photoUpload' type='file' onChange={uploadHandler} /> */}
            <input
              hidden
              type='file'
              accept='image/*'
              capture='environment'
              onChange={capture}
              id='photoUpload'
            />
          </div>
        )}
        {captured && (
          <div className='take-photo__photos'>
            <div className='take-photo__preview-wrapper'>
              <button
                className='take-photo__clear-preview'
                onClick={clearCanvas}>
                <RemoveCircle className='take-photo__cta-tertiary-icon' />
              </button>
              <img
                src=''
                className='take-photo__preview'
                ref={preview}
                alt=''
              />
            </div>
          </div>
        )}
        <div>
          {uploadProgress && uploadProgress !== 100 ? (
            <>
              {uploadProgress}{' '}
              <progress max='100' value={uploadProgress}></progress>
            </>
          ) : null}
          {error && <p className='-is-error'>{error}</p>}
        </div>
      </div>
    </>
  );
};

export default TakePhoto;
