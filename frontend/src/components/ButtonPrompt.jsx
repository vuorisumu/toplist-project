import PropTypes from "prop-types";

function ButtonPrompt({ buttonName, prompt }) {
  const showPrompt = () => {
    console.log("Show prompt");
  };
  return (
    <div>
      <button type="button" onClick={showPrompt}>
        {buttonName}
      </button>
    </div>
  );
}

ButtonPrompt.propTypes = {
  buttonName: PropTypes.string.isRequired,
  prompt: PropTypes.string,
};

export default ButtonPrompt;
