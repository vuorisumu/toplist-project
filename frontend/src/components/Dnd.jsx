import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const DndContainer = ({ containers, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={(res) => onDragEnd(res, containers)}>
      {Object.entries(containers).map(([id, container]) => (
        <div key={id}>
          <h3>{container.name}</h3>
          <div id={container.name}>
            <DroppableContainer container={container} />
          </div>
        </div>
      ))}
    </DragDropContext>
  );
};

DndContainer.propTypes = {
  containers: PropTypes.object.isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

const DroppableContainer = ({ container }) => {
  return (
    <Droppable droppableId={container.keyName} key={container.keyName}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: snapshot.isDraggingOver ? "lightgray" : "darkgray",
          }}
        >
          {container.items.map((item, index) => (
            <DraggableItem
              key={item.item_name}
              item={item}
              index={index}
              containerKeyName={container.keyName}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

DroppableContainer.propTypes = {
  container: PropTypes.shape({
    keyName: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
};

const DraggableItem = ({ item, index, containerKeyName }) => {
  const ITEMS_RANKED = "ranked";
  return (
    <Draggable key={item.item_name} draggableId={item.item_name} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            backgroundColor: snapshot.isDragging ? "darkmagenta" : "darkgray",
            ...provided.draggableProps.style,
          }}
        >
          {/* Rank number only on ranked container */}
          {containerKeyName === ITEMS_RANKED && (
            <div className="rank-number">{index + 1}</div>
          )}

          {/* Item */}
          {item.item_name}
        </div>
      )}
    </Draggable>
  );
};

DraggableItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  containerKeyName: PropTypes.string.isRequired,
};

export { DndContainer, DraggableItem, DroppableContainer };
