import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function Terms({ file }) {
  const t = `/${file}`;
  const [text, setText] = useState("");
  useEffect(() => {
    fetch(t)
      .then((r) => r.text())
      .then((text) => {
        setText(text);
      })
      .catch((err) => {
        console.error("Error loading text file:", err);
        setText(`Error loading ${file}`);
      });
  });

  return (
    <div className="terms">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export default Terms;
