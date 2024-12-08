export const compressMedia = async (mediaItem: any) => {
  if (!mediaItem.type.startsWith('image/')) {
    return mediaItem;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = mediaItem.data;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set maximum dimensions
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      resolve({
        ...mediaItem,
        data: canvas.toDataURL(mediaItem.type, 0.7) // Compress with 0.7 quality
      });
    };
  });
}; 