import { Buffer } from "buffer";
import { fetchImage } from "../api/images";
import { formatData } from "./dataHandler";

/**
 * Resizes a given image to preferred dimensions if it is too big.
 *
 * @param {File} file - Image file to be resized
 * @param {JSON} options - Options for maximum size and quality
 * @returns the given file resized
 */
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

/**
 * Converts an image file to base64 and returns the URL of the image.
 *
 * @param {File} image - Image file from which to get the URL
 * @returns the image URL, or an error on unsuccessful conversion.
 */
export const getImgUrl = (image) => {
  try {
    const base64Image = Buffer.from(image.data).toString("base64");
    return `data:image/png;base64,${base64Image}`;
  } catch (err) {
    return err;
  }
};

/**
 * Converts a given blob to a File
 *
 * @param {Blob} data - Image data to be converted to a File
 * @returns the given blob converted to a File
 */
export const blobToFile = (data) => {
  const blob = new Blob([new Uint8Array(data.data)], {
    type: data.contentType,
  });
  const file = new File([blob], "fetched_image." + blob.type.split("/")[1], {
    type: blob.type,
  });
  return file;
};

/**
 * Fetches all images from the database and convert them to urls.
 *
 * @param {Array} imageIds - Array of image ids
 * @returns the images in an array
 */
export const getItemImages = async (imageIds) => {
  const fetchImagePromises = imageIds.map((id) => fetchImage(id));
  const fetchedImages = await Promise.all(fetchImagePromises);
  return fetchedImages
    .map((imageData) => formatData(imageData)[0])
    .map((formattedData) => ({
      ...formattedData,
      img_url: getImgUrl(formattedData.img),
    }));
};
