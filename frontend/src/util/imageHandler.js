import { Buffer } from "buffer";

export const resizeImage = async (
  file,
  options = {
    maxWidth: 1024,
    maxHeight: 768,
    quality: 0.7,
  }
) => {
  const calculateSize = (img) => {
    let w = img.width,
      h = img.height;

    if (w > options.maxWidth) {
      h = Math.round((h * options.maxWidth) / w);
      w = options.maxWidth;
    }
    if (h > options.maxHeight) {
      w = Math.round((w * options.maxHeight) / h);
      h = options.maxHeight;
    }

    return [w, h];
  };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onerror = function () {
        reject(new Error("Failed to load image."));
      };
      img.onload = function () {
        const [newWidth, newHeight] = calculateSize(img);
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const contentType = file.type;
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File(
              [blob],
              options.newFileName + "." + contentType.split("/")[1],
              {
                type: contentType,
                lastModified: Date.now(),
              }
            );

            resolve(resizedFile);
          },
          contentType,
          options.quality
        );
      };
    };
    reader.readAsDataURL(file);
  });
};

export const getImgUrl = (image) => {
  try {
    const base64Image = Buffer.from(image.data).toString("base64");
    return `data:image/png;base64,${base64Image}`;
  } catch (err) {
    return err;
  }
};
