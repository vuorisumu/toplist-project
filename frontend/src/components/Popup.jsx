function Popup({ content, close }) {
  return (
    <div className="popup" onClick={close}>
      <div className="popup-window" onClick={(e) => e.stopPropagation()}>
        <button onClick={close}>x</button>
        <div className="content">{content}</div>
      </div>
    </div>
  );
}

export default Popup;
