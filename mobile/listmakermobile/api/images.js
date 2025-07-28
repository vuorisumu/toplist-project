import { BASE_URL, fetchAndFormat } from "./apiutils";

export const fetchImage = (id) => fetchAndFormat(`/images/${id}`);

export const addNewImages = (images) => {
    const formData = new FormData();
    console.log("images", images);

    images.forEach((image, index) => {
        const fileName = image.img.fileName || "image.jpg";
        const imageFile = {
            uri: image.img.uri,
            name: fileName,
            type: `${image.img.type || "image"}/${fileName.split(".").pop()}`,
        };
        console.log(imageFile);
        formData.append(`imageId[${index}]`, image.id);
        formData.append(`image[${index}]`, imageFile);
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
