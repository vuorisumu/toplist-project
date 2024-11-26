import { useRef, useState } from "react";
import { resizeImage } from "../util/imageHandler";
import { v4 as uuid } from "uuid";

function AddItems({ hasImages, addEntry, sendError }) {
  const [newImage, setNewImage] = useState({});
  const imgRef = useRef();
  const [newEntry, setNewEntry] = useState("");

  /**
   * Resizes the given image and adds it to state.
   *
   * @param {ChangeEvent} e - event containing information about the current value
   */
  const handleAddItemImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resized = await resizeImage(file, {
        maxWidth: 150,
        maxHeight: 150,
      });
      const imgId = uuid();
      setNewImage({
        id: imgId,
        img: resized,
      });
      console.log("added imgae");
    } else {
      console.log("no file");
    }
  };

  const handleAddEntry = () => {
    if (hasImages && !newImage.id) {
      sendError("New item must have an image");
      document.getElementById("newItemsCont").classList.add("error");
    } else {
      document.getElementById("newItemsCont").classList.remove("error");
    }

    if (newEntry.trim() !== "" && (!hasImages || (hasImages && newImage.id))) {
      const addedEntry = {
        item_name: newEntry,
        deletable: true,
        id: uuid(),
      };

      if (hasImages) {
        addedEntry.img_id = newImage.id;
        addedEntry.img_url = URL.createObjectURL(newImage.img);
        addEntry(addedEntry, newImage);
      } else {
        addEntry(addedEntry);
      }

      setNewEntry("");
      if (hasImages) {
        setNewImage({});
        imgRef.current.value = "";
      }
    }
  };

  return (
    <div className="newItemsCont" id="newItemsCont">
      {hasImages && (
        <div className="itemImage">
          {newImage?.img ? (
            <img src={URL.createObjectURL(newImage.img)} />
          ) : (
            <span className="material-symbols-outlined imagePlaceholder">
              image
            </span>
          )}

          <label className="fileInput">
            <input
              type="file"
              ref={imgRef}
              id={`newImage`}
              name={`newImage`}
              accept="image/png, image/gif, image/jpeg"
              onChange={handleAddItemImage}
            />
          </label>
        </div>
      )}

      <input
        type="text"
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder="New Item"
      />

      <button type="button" onClick={handleAddEntry}>
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}

export default AddItems;
