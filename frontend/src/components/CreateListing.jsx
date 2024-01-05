import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchTemplateById } from "./api";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

function CreateListing() {
  const location = useLocation();
  const templateId = parseInt(location.pathname.replace("/createlisting/", ""));
  if (isNaN(templateId)) {
    console.error("Invalid templateId: ", templateId);
  }

  // drag n drop containers
  const ITEMS_RANKED = "ranked";
  const ITEMS_REMAINING = "unused";
  const itemContainers = {
    [ITEMS_RANKED]: {
      name: "Ranked",
      keyName: ITEMS_RANKED,
      items: [],
    },
    [ITEMS_REMAINING]: {
      name: "Unused items",
      keyName: ITEMS_REMAINING,
      items: [],
    },
  };

  const [template, setTemplate] = useState(null);
  const [containers, setContainers] = useState(itemContainers);
  const [newEntry, setNewEntry] = useState("");

  // fetch selected template
  useEffect(() => {
    fetchTemplateById(templateId)
      .then((data) => {
        setTemplate(data[0]);

        // set initial containers
        setContainers((cont) => ({
          [ITEMS_RANKED]: { ...cont[ITEMS_RANKED], items: [] },
          [ITEMS_REMAINING]: {
            ...cont[ITEMS_REMAINING],
            items: JSON.parse(data[0].items) || [],
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [templateId]);

  // adds new entry to template
  const addEntry = () => {
    // only adds new if entry isn't empty
    if (newEntry.trim() !== "") {
      setContainers((prevContainers) => ({
        ...prevContainers,
        [ITEMS_REMAINING]: {
          ...prevContainers[ITEMS_REMAINING],
          items: [
            ...prevContainers[ITEMS_REMAINING].items,
            { item_name: newEntry, deletable: true },
          ],
        },
      }));

      // reset entry
      setNewEntry("");
    }
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
  const onDragEnd = (res, containers, setContainers) => {
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
      destItems.splice(destination.index, 0, moved);
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
      setContainers({
        ...containers,
        [source.droppableId]: {
          ...cont,
          items: contItems,
        },
      });
    }
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Create a Ranking</h1>
      <div>
        <p>Template name: {template.name}</p>
        <p>Template creator: {template.user_name}</p>
      </div>

      <DragDropContext
        onDragEnd={(res) => onDragEnd(res, containers, setContainers)}
      >
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
                        key={item.item_name}
                        draggableId={item.item_name}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
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
                            {container.keyName === ITEMS_RANKED && (
                              <div className="rank-number">{index + 1}</div>
                            )}
                            {item.item_name}
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

      <label>New item: </label>
      <input
        type="text"
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder="New Item"
      />
      <button type="button" onClick={addEntry}>
        Add
      </button>
    </div>
  );
}

export default CreateListing;
