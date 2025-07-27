import { BASE_URL, fetchAndFormat } from "./apiutils";

export const fetchImage = (id) => fetchAndFormat(`/images/${id}`);

export const addNewImages = (images) => {
    const formData = new FormData();
    images.forEach((image, index) => {
        formData.append(`imageId[${index}]`, image.id);
        formData.append(`image[${index}]`, image.img);
    });

    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    return fetch(`${BASE_URL}/images/`, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
};
