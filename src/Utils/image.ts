export const blobToBase64 = (blob:File):Promise<string> => new Promise((resolve, reject) => {
 if(!blob){
    return;
} 
  const reader: FileReader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});