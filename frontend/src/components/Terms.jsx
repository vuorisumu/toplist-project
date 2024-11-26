import { useEffect, useState } from "react";
import t from "../assets/terms.txt";
import ReactMarkdown from "react-markdown";

function Terms() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch(t)
      .then((r) => r.text())
      .then((text) => {
        setText(text);
      });
  });

  return (
    <div className="terms">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export default Terms;
