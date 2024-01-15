import PropTypes from "prop-types";
import { useState } from "react";

/**
 * Reusable button component that prompts for user confirmation
 * @param {string} props.buttonName - text displayed on the main button
 * @param {string} props.prompt - optional prompt text, defaults to "Are you sure?" if not specified
 * @param {function} props.confirm - callback function to be executed when the user confirms the action
 * @returns JSX element rendering a button with confirmation prompt
 */
function ButtonPrompt({ buttonName, prompt, confirm }) {
  const [promptVisible, setPromptVisible] = useState(false);

  /**
   * Sets the prompt visible
   */
  const showPrompt = () => {
    setPromptVisible(true);
  };

  /**
   * Hides the prompt
   */
  const cancel = () => {
    setPromptVisible(false);
  };

  return (
    <div className="promptCont">
      {promptVisible ? (
        <>
          <p>{prompt || "Are you sure?"}</p>
          <button type="button" onClick={confirm} className="confirmButton">
            {buttonName}
          </button>
          <button type="button" onClick={cancel} className="cancelButton">
            Cancel
          </button>
        </>
      ) : (
        <button type="button" onClick={showPrompt} className="confirmButton">
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
