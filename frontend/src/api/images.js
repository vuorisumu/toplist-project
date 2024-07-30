const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://toplistmaker.onrender.com/api";

/**
 * Fetches an image from the database by the given ID
 *
 * @param {string} id - The ID of the image
 * @returns a response containing the fetched image
 */
export const fetchImage = (id) => {
  return fetch(`${API_BASE_URL}/images/${id}`).then((response) =>
    response.json()
  );
};

/**
 * Adds a new image to database
 *
 * @param {object} images - image data
 * @returns the ID of the newly added template on successful insert
 */
export const addNewImages = (images) => {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append(`imageId[${index}]`, image.id);
    formData.append(`image[${index}]`, image.img);
  });

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return fetch(`${API_BASE_URL}/images/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
};
