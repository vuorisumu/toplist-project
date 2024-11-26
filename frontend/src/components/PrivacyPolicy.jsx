import { useEffect, useState } from "react";
import t from "../assets/privacypolicy.txt";
import ReactMarkdown from "react-markdown";

function PrivacyPolicy() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch(t)
      .then((r) => r.text())
      .then((text) => {
        setText(text);
      });
  });

  return (
    <div className="privacypolicy">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export default PrivacyPolicy;
