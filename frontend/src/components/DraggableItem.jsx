import { Draggable } from "@hello-pangea/dnd";

function DraggableItem({ item, index, isRanked }) {
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
              <p>Loading</p>
            ))}

          <p>{item.item_name}</p>
        </div>
      )}
    </Draggable>
  );
}

export default DraggableItem;
