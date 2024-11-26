function Popup({ content }) {
  return (
    <div className="popup">
      <button onClick={() => console.log("button")}>x</button>
      <div className="content">{content}</div>
    </div>
  );
}

export default Popup;
