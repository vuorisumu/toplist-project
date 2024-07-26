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
 * @param {object} image - image data
 * @returns the ID of the newly added template on successful insert
 */
export const addNewImage = (image) => {
  const formData = new FormData();
  formData.append("id", image.id);
  formData.append("img", image.img);

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
