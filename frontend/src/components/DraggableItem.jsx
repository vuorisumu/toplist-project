import { Draggable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import { fetchImage } from "../api/images";
import { formatData } from "../util/dataHandler";
import { getImgUrl } from "../util/imageHandler";

/**
 * Reusable Item component for displaying the items on top list creation view.
 *
 * @param {object} props.item - The item data to be displayed
 * @param {number} props.index - The index of the item
 * @param {boolean} props.blank - Whether the template is blank
 * @param {boolean} props.isRanked - Whether this item is in the ranked container or not
 * @param {function} props.updateName - Callback function for updating item name
 * @param {function} props.updateNote - Callback function for updating the note on the item
 * @param {function} props.deleteItem - Callback function for deleting the item
 * @returns {JSX.Element} Draggable Item to be used inside a Droppable
 */
function DraggableItem({
  item,
  index,
  blank = false,
  isRanked,
  updateName,
  updateNote,
  deleteItem,
}) {
  const [showNote, setShowNote] = useState(false);
  const [editName, setEditName] = useState(false);
  const [imgUrl, setImgUrl] = useState(item.img_url ? item.img_url : "");
  const itemRef = useRef(null);
  useEffect(() => {
    if (item.img_id && !item.img_url) {
      fetchImage(item.img_id).then((data) => {
        const formattedData = formatData(data);
        const url = getImgUrl(formattedData[0].img);
        setImgUrl(url);
        item.img_url = url;
      });
    }
  }, [item.img_id]);

  useEffect(() => {
    const clickOutside = (event) => {
      if (
        editName &&
        itemRef.current &&
        !itemRef.current.contains(event.target)
      ) {
        setEditName(false);
      }
    };

    if (editName && itemRef.current) {
      itemRef.current.focus();
    }

    document.addEventListener("pointerdown", clickOutside);

    return () => {
      document.removeEventListener("pointerdown", clickOutside);
    };
  }, [itemRef, editName]);

  const handleNameUpdate = (e) => {
    updateName(item.id, e.target.value, blank);
  };

  /**
   * Handles the note update.
   *
   * @param {Event} e - Event data containing information about the current value
   */
  const handleNoteUpdate = (e) => {
    updateNote(item.id, e.target.value);
  };

  /**
   * Handles the item deletion.
   */
  const handleDelete = () => {
    deleteItem(index, blank);
  };

  return (
    <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          className={`rank-item ${
            snapshot.isDragging ? "dragging" : "no-drag"
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Rank number only on ranked container */}
          {isRanked && <div className="rank-number">{index + 1}.</div>}

          {/* Item */}
          {item.img_id &&
            (imgUrl !== "" ? (
              <div className="itemImage">
                <img src={imgUrl} />
              </div>
            ) : (
              <span className="material-symbols-outlined imagePlaceholder">
                pending
              </span>
            ))}

          {editName ? (
            <input
              type="text"
              value={item.item_name}
              onChange={handleNameUpdate}
              ref={itemRef}
            />
          ) : (
            <p onClick={() => setEditName(true)}>{item.item_name}</p>
          )}

          {isRanked &&
            (showNote ? (
              <>
                {/* Delete note */}
                <button type="button" onClick={() => setShowNote(false)}>
                  <span className="material-symbols-outlined">minimize</span>
                </button>

                {/* Note field */}
                <textarea
                  value={item.item_note}
                  className="noteArea"
                  onChange={handleNoteUpdate}
                />
              </>
            ) : (
              <>
                {/* Add note button */}

                <button type="button" onClick={() => setShowNote(true)}>
                  <span className="material-symbols-outlined">add_notes</span>
                </button>

                {item.item_note && (
                  <p className={`rankedNote ${item.img_id ? "img" : ""}`}>
                    {item.item_note}
                  </p>
                )}
              </>
            ))}

          {/* Delete button only on unranked container */}
          {((item.deletable && !isRanked) || blank) && (
            <button type="button" onClick={handleDelete}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default DraggableItem;
