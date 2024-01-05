import React from "react";
import { useLocation } from "react-router-dom";

function CreateListing() {
  const location = useLocation();

  return (
    <div>
      <h1>Create a Ranking</h1>
      <p>Path name: {location.pathname}</p>
    </div>
  );
}

export default CreateListing;
