import PropTypes from "prop-types";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";

function DnDContainer({
  containers,
  setContainers,
  ITEMS_RANKED,
  ITEMS_REMAINING,
}) {
  // items with notes
  const [selectedItems, setSelectedItems] = useState([]);

  // update item note on a selected item
  const updateNote = (note, item) => {
    const updatedItems = containers[ITEMS_RANKED].items.map((curItem) => {
      if (curItem.item_name === item.item_name) {
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

  // deletes the item note from a selected item
  const deleteNote = (itemWithNote) => {
    const updatedItems = containers[ITEMS_RANKED].items.map((item) => {
      if (item.item_name === itemWithNote.item_name) {
        return { ...item, item_note: undefined };
      }
      return item;
    });

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

  // delete added entry
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

  // handles the drag n drop
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

        if (sourceItems.length - 1 < sourceCont.default_size) {
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
        if (destItems.length > destCont.default_size) {
          // take the last item on ranked list
          const lastItem = destItems[destItems.length - 1];

          if (lastItem?.blank) {
            // destroy item if it's blank
            destItems.splice(destItems.length - 1, 1);
          } else {
            // move item to unused if it's not blank
            const [dropped] = destItems.splice(destItems.length - 1, 1);
            sourceItems.splice(0, 0, dropped);
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
        <div key={id}>
          <h3>{container.name}</h3>
          <div id={container.name}>
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver
                      ? "lightgray"
                      : "darkgray",
                  }}
                >
                  {container.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="rank-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            backgroundColor: snapshot.isDragging
                              ? "darkmagenta"
                              : "darkgray",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {/* Rank number only on ranked container */}
                          {container.keyName === ITEMS_RANKED && (
                            <div className="rank-number">{index + 1}</div>
                          )}

                          {/* Item */}
                          {item.item_name}

                          {/* Note options only on ranked container */}
                          {container.keyName === ITEMS_RANKED && (
                            <>
                              {selectedItems.some(
                                (selectedItem) =>
                                  selectedItem.item_name === item.item_name
                              ) ? (
                                <>
                                  {/* Note field */}
                                  <textarea
                                    value={item.item_note}
                                    onChange={(e) => {
                                      updateNote(e.target.value, item);
                                    }}
                                  />

                                  {/* Delete note */}
                                  <button
                                    type="button"
                                    onClick={() => deleteNote(item)}
                                  >
                                    Delete note
                                  </button>
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
                                      Add note
                                    </button>
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
                                X
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