function NewTemplate() {
  return (
    <>
      <h1>New Template</h1>
      <div>
        <h2>Template info</h2>
        <label>Template name: </label>
        <input type="text" placeholder="New Template" />
        <br />
        <label>Template description: </label>
        <textarea placeholder="Description" />
        <br />
        <label>Creator name: </label>
        <input type="text" placeholder="Creator" />
      </div>

      <div>
        <h2>Template items</h2>
        <input type="text" placeholder="New item" />
        <br />
        <button type="button">+</button>
      </div>
    </>
  );
}

export default NewTemplate;
