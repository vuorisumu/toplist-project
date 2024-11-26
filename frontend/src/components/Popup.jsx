function Popup({ content }) {
  return (
    <div className="popup">
      <div className="popup-window">
        <button onClick={() => console.log("button")}>x</button>
        <div className="content">{content}</div>
      </div>
    </div>
  );
}

export default Popup;
