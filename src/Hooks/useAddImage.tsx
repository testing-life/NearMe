import { User } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const useAddImage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  //   useEffect(() => {
  //     first;

  //     return () => {
  //       second;
  //     };
  //   }, [third]);

  const storageUploadHook = (
    user: User,
    storage: FirebaseStorage,
    data: File | null = null
  ): void => {
    if (!data) {
      return;
    }
    const storageRef = ref(storage, `${user?.uid || 'img'}/${data.name}`);
    const uploadTask = uploadBytesResumable(storageRef, data);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        setUploadError(`${error.cause} ${error.message}`);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        if (downloadUrl) {
          setDownloadUrl(downloadUrl);
        }
      }
    );
  };

  return { uploadProgress, downloadUrl, storageUploadHook, uploadError };
};
