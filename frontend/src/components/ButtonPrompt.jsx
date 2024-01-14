import PropTypes from "prop-types";
import { useState } from "react";

function ButtonPrompt({ buttonName, prompt, confirm }) {
  const [promptVisible, setPromptVisible] = useState(false);
  const showPrompt = () => {
    setPromptVisible(true);
  };

  const cancel = () => {
    setPromptVisible(false);
  };

  return (
    <div>
      {promptVisible ? (
        <>
          <p>{prompt || "Are you sure?"}</p>
          <button type="button" onClick={confirm}>
            {buttonName}
          </button>
          <button type="button" onClick={cancel}>
            Cancel
          </button>
        </>
      ) : (
        <button type="button" onClick={showPrompt}>
          {buttonName}
        </button>
      )}
    </div>
  );
}

ButtonPrompt.propTypes = {
  buttonName: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  confirm: PropTypes.func.isRequired,
};

export default ButtonPrompt;
