import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

/**
 * Reusable Item component for displaying the items on top list creation view.
 *
 * @param {object} props.item - The item data to be displayed
 * @param {number} props.index - The index of the item
 * @param {boolean} props.isRanked - Whether this item is in the ranked container or not
 * @param {function} props.updateNote - Callback function for updating the note on the item
 * @param {function} props.deleteItem - Callback function for deleting the item
 * @returns {JSX.Element} Draggable Item to be used inside a Droppable
 */
function DraggableItem({ item, index, isRanked, updateNote, deleteItem }) {
  const [showNote, setShowNote] = useState(false);

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
    deleteItem(index);
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
            (item.img_url ? (
              <div className="itemImage">
                <img src={item.img_url} />
              </div>
            ) : (
              <span className="material-symbols-outlined imagePlaceholder">
                pending
              </span>
            ))}

          <p>{item.item_name}</p>

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
                  <p className="rankedNote">{item.item_note}</p>
                )}
              </>
            ))}

          {/* Delete button only on unranked container */}
          {item.deletable && !isRanked && (
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
