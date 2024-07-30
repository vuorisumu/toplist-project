import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DraggableItem from "./DraggableItem";

/**
 * Drag n Drop container for creating ranked top lists. Elements can be
 * moved from one container to another and they can be rearranged. When the
 * containers are rearranged, sends the rearranged containers back to parent object.
 *
 * @param {JSON} props.containers - container objects that can be used as drag and drop fields
 * @param {useState} props.setContainers - callback setContainers for resetting the container data
 * @returns {JSX.Element} containing Drag n Drop functionality
 */
function RankItems({ containers, setContainers }) {
  const RANKED = "ranked";
  const UNRANKED = "unused";

  const onDragEnd = (res) => {
    if (!res.destination) return;
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

  const updateNote = (id, note) => {
    const updatedItems = containers[RANKED].items.map((i) => {
      if (i.id === id) {
        return note === ""
          ? { ...i, item_note: undefined }
          : { ...i, item_note: note };
      }
      return i;
    });

    setContainers((prev) => ({
      ...prev,
      [RANKED]: {
        ...prev[RANKED],
        items: updatedItems,
      },
    }));
  };

  const deleteItem = (index) => {
    setContainers((prev) => ({
      ...prev,
      [UNRANKED]: {
        ...prev[UNRANKED],
        items: prev[UNRANKED].items.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <DragDropContext onDragEnd={(res) => onDragEnd(res)}>
      {Object.entries(containers).map(([id, container]) => (
        <div key={id} className="dndCont">
          <h3>{container.name}</h3>
          <div id={container.name}>
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={`droppable ${
                    snapshot.isDraggingOver ? "dragOver" : "no-drag"
                  }`}
                  {...provided.droppableProps}
                >
                  {container.items.map((item, index) => (
                    <DraggableItem
                      item={item}
                      index={index}
                      isRanked={container.keyName === RANKED}
                      updateNote={updateNote}
                      deleteItem={deleteItem}
                      key={item.id}
                    />
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

export default RankItems;
