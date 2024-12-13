import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListData from "./ListData";
import { fetchToplistById } from "../api/toplists";
import { isCreatorOfList } from "../util/permissions";
import { formatData } from "../util/dataHandler";

function EditToplist() {
  const location = useLocation();
  const navigate = useNavigate();
  const listId = parseInt(location.pathname.replace("/edit-list/", ""));
  const [canEdit, setCanEdit] = useState(false);
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (canEdit) {
      fetchList();
    }
  }, [canEdit]);

  const checkPermission = async () => {
    try {
      const isCreator = await isCreatorOfList(listId);
      setCanEdit(isCreator);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchList = async () => {
    await fetchToplistById(listId)
      .then((data) => {
        const formattedData = formatData(data);
        console.log(formattedData);
        if (formattedData.length > 0) {
          console.log(formattedData[0]);
          setData(formattedData[0]);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setNotFound(true);
        console.log(err);
      });
  };

  if (notFound) {
    return (
      <div className="container">
        <h1>Not found</h1>
        <p>{`Top list doesn't exist or it has been deleted`}</p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="container">
        <h1>Edit top list</h1>
        <div className="no-stretch">
          <p>You don't have a permission to edit this top list</p>
          <br />
          <button onClick={() => navigate(-1)} className="backButton">
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!data || loading) {
    return (
      <div className="container">
        <h1>Edit top list</h1>
        <div className="no-stretch">
          <p>Loading...</p>
          <br />
          <button onClick={() => navigate(-1)} className="backButton">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <ListData
        data={data}
        templateId={data.template_id}
        submitText={"Update top list"}
      />
    </div>
  );
}

export default EditToplist;
