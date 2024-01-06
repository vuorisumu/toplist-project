import { useState, useEffect } from "react";
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
  const [rankingName, setRankingName] = useState("");
  const [rankingDesc, setRankingDesc] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [newEntry, setNewEntry] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

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

  // save ranking
  const saveRanking = () => {
    if (containers[ITEMS_RANKED].items.length === 0 || !rankingName) {
      console.log("Cannot save");
      return;
    }

    // store ranking data
    let rankingData = {
      ranking_name: rankingName,
      template_id: templateId,
      items: containers[ITEMS_RANKED].items,
    };

    if (creatorName !== "") {
      // fetch creator id here !!!
      console.log(creatorName);
    }

    if (rankingDesc !== "") {
      rankingData.description = rankingDesc;
      console.log(rankingDesc);
    }

    containers[ITEMS_RANKED].items.map((item) => {
      console.log(item.item_name + " ranked at " + item.rank_number);
    });
  };

  // clear all fields
  const clearAll = () => {
    window.location.reload(false);
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

      destItems.forEach((item, index) => {
        item.rank_number = index + 1;
      });

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

      {/* Template information */}
      <div>
        <p>Template name: {template.name}</p>
        <p>Template creator: {template.user_name}</p>
      </div>

      {/* Ranking information */}
      <div>
        <label>Ranking title: </label>
        <input
          type="text"
          value={rankingName}
          onChange={(e) => setRankingName(e.target.value)}
          placeholder="Ranking Title"
        />

        <label>Description: </label>
        <textarea
          value={rankingDesc}
          onChange={(e) => setRankingDesc(e.target.value)}
          placeholder="Ranking description"
        />

        <label>Creator name: </label>
        <input
          type="text"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="Creator Name"
        />
      </div>

      {/* Ranking builder */}
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

      {/* Add new items */}
      <div>
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

      {/* Save changes */}
      <div>
        <button type="button" onClick={saveRanking}>
          Save Ranking
        </button>

        <button type="button" onClick={clearAll}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default CreateListing;
