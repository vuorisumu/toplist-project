import { useEffect, useRef } from "react";

function Popup({ content, close }) {
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [ref]);

  return (
    <div className="popup">
      <div className="popup-window" ref={ref}>
        <button onClick={close}>x</button>
        <div className="content">{content}</div>
      </div>
    </div>
  );
}

export default Popup;
