import PropTypes from "prop-types";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";

/**
 * Renders a Drag n Drop element with two containers, the first one of which is where the user makes the
 * ranking, and the second one containing all the items in the chosen template. Elements can be rearranges by
 * dragging the items. The ranked container shows five placeholder elements, but can be expanded by adding more
 * than five elements to it.
 * @param {JSON} props.containers - container objects that can be used as drag and drop fields
 * @param {useState} props.setContainers - callback setContainers for resetting the container data
 * @param {string} props.ITEMS_RANKED - name variable of the ranked items container
 * @param {string} props.ITEMS_REMAINING - name variable of the unranked items container
 * @returns JSX element containing Drag n Drop functionality
 */
function DnDContainer({
  containers,
  setContainers,
  ITEMS_RANKED,
  ITEMS_REMAINING,
}) {
  // items with notes
  const [selectedItems, setSelectedItems] = useState([]);
  const minSize = 5;

  /**
   * Updates the note on a specified item and re-sets the containers with updated data
   * @param {string} note - the note to be added to the item
   * @param {object} item - item to be updated
   */
  const updateNote = (note, item) => {
    const updatedItems = containers[ITEMS_RANKED].items.map((curItem) => {
      if (curItem.id === item.id) {
        return { ...curItem, item_note: note };
      }
      return curItem;
    });

    // set containers again
    setContainers((prevContainers) => ({
      ...prevContainers,
      [ITEMS_RANKED]: {
        ...prevContainers[ITEMS_RANKED],
        items: updatedItems,
      },
    }));
  };

  /**
   * Minimizes the note field, making the note uneditable. If the note is
   * empty, deletes the note
   * @param {object} itemWithNote - item that has the note
   */
  const hideNote = (itemWithNote) => {
    let updatedItems = [];
    if (!itemWithNote.item_note) {
      updatedItems = containers[ITEMS_RANKED].items.map((item) => {
        if (item.id === itemWithNote.id) {
          return { ...item, item_note: undefined };
        }
        return item;
      });
    } else {
      updatedItems = containers[ITEMS_RANKED].items;
    }

    // set containers again
    setContainers((prevContainers) => ({
      ...prevContainers,
      [ITEMS_RANKED]: {
        ...prevContainers[ITEMS_RANKED],
        items: updatedItems,
      },
    }));

    // delete current item from selected items
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter(
        (selectedItem) => selectedItem.item_name !== itemWithNote.item_name
      )
    );
  };

  /**
   * Deletes an user added item that isn't a part of the original template from
   * a specified index. Can only delete an item that is currently in the unused
   * items container. Updates the item containers with the updated data
   * @param {number} index - index of the item to be deleted
   */
  const deleteItem = (index) => {
    setContainers((prevContainers) => ({
      ...prevContainers,
      [ITEMS_REMAINING]: {
        ...prevContainers[ITEMS_REMAINING],
        items: prevContainers[ITEMS_REMAINING].items.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  /**
   * Handles the data from dragging and dropping an item, and updates the
   * item containers with the updated placements of the items
   * @param {Response} res - Response containing information of the drag and drop source and destination
   * @param {object} containers - containers to be updated with the dnd result
   */
  const onDragEnd = (res, containers) => {
    if (!res.destination) {
      return;
    }
    const { source, destination } = res;

    if (source.droppableId !== destination.droppableId) {
      // set source and destination
      const sourceCont = containers[source.droppableId];
      const destCont = containers[destination.droppableId];

      // set items to source and destination
      const sourceItems = [...sourceCont.items];
      const destItems = [...destCont.items];

      // deletes and adds items
      const [moved] = sourceItems.splice(source.index, 1);

      // add to destination
      destItems.splice(destination.index, 0, moved);

      // reassign rank numbers
      destItems.forEach((item, index) => {
        item.rank_number = index + 1;
      });

      const draggedItem = sourceCont.items[source.index];
      if (destCont.keyName === ITEMS_REMAINING) {
        // dragged to unused
        if (draggedItem.blank) {
          return;
        }

        if (sourceItems.length < minSize) {
          // add new blank to list if it gets too small
          const newBlank = {
            item_name: " ",
            blank: true,
            id: uuid(),
          };

          sourceItems.splice(sourceItems.length - 1, 0, newBlank);
        }

        sourceItems.sort((a, b) => (!a?.blank && b?.blank ? -1 : 1));
      } else {
        // dragged to ranked
        destItems.sort((a, b) => (!a?.blank && b?.blank ? -1 : 1));
        if (destItems.length > minSize) {
          // take the last item on ranked list
          const lastItem = destItems[destItems.length - 1];

          // destroy item if it's blank
          if (lastItem?.blank) {
            destItems.splice(destItems.length - 1, 1);
          }
        }
      }

      setContainers({
        ...containers,
        [source.droppableId]: {
          ...sourceCont,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCont,
          items: destItems,
        },
      });
    } else {
      // rearrange container
      const cont = containers[source.droppableId];
      const contItems = [...cont.items];
      const [moved] = contItems.splice(source.index, 1);
      contItems.splice(destination.index, 0, moved);

      contItems.forEach((item, index) => {
        item.rank_number = index + 1;
      });

      contItems.sort((a, b) => (!a?.blank && b?.blank ? -1 : 1));
      setContainers({
        ...containers,
        [source.droppableId]: {
          ...cont,
          items: contItems,
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={(res) => onDragEnd(res, containers)}>
      {Object.entries(containers).map(([id, container]) => (
        <div key={id} className="dndCont">
          <h3>{container.name}</h3>
          <div id={container.name}>
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`droppable ${
                    snapshot.isDraggingOver ? "dragOver" : "no-drag"
                  }`}
                >
                  {container.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
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
                          {container.keyName === ITEMS_RANKED && (
                            <div className="rank-number">{index + 1}.</div>
                          )}

                          {/* Item */}
                          <p>{item.item_name}</p>

                          {/* Note options only on ranked container */}
                          {container.keyName === ITEMS_RANKED && (
                            <>
                              {selectedItems.some(
                                (selectedItem) => selectedItem.id === item.id
                              ) ? (
                                <>
                                  {/* Delete note */}
                                  <button
                                    type="button"
                                    onClick={() => hideNote(item)}
                                  >
                                    <span className="material-symbols-outlined">
                                      delete_sweep
                                    </span>
                                  </button>

                                  {/* Note field */}
                                  <textarea
                                    value={item.item_note}
                                    className="noteArea"
                                    onChange={(e) => {
                                      updateNote(e.target.value, item);
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  {/* Add note button */}
                                  {!item.blank && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSelectedItems([
                                          ...selectedItems,
                                          item,
                                        ])
                                      }
                                    >
                                      <span className="material-symbols-outlined">
                                        add_notes
                                      </span>
                                    </button>
                                  )}

                                  {item.item_note && (
                                    <p className="rankedNote">
                                      {item.item_note}
                                    </p>
                                  )}
                                </>
                              )}
                            </>
                          )}

                          {/* Delete button only on unranked container */}
                          {item.deletable &&
                            container.keyName === ITEMS_REMAINING && (
                              <button
                                type="button"
                                onClick={() => deleteItem(index)}
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </button>
                            )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      ))}
    </DragDropContext>
  );
}

DnDContainer.propTypes = {
  containers: PropTypes.object.isRequired,
  setContainers: PropTypes.func.isRequired,
  ITEMS_RANKED: PropTypes.string.isRequired,
  ITEMS_REMAINING: PropTypes.string.isRequired,
};

export { DnDContainer };
