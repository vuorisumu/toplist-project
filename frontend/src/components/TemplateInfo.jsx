import { useEffect, useState } from "react";
import { getCategoryById } from "../util/storage";
import { Link } from "react-router-dom";
import { getImgUrl } from "../util/imageHandler";

function TemplateInfo({ data }) {
  const [category, setCategory] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (data) {
      if (data.cover_image) setImgUrl(getImgUrl(data.cover_image));

      getCategoryById(data.category)
        .then((c) => setCategory(c))
        .catch((err) => console.log(err));
    }
  }, [data]);

  return (
    <div className="templateInfo">
      {data && (
        <>
          {" "}
          <p>
            {"Template "}
            <Link to={`/templates/${data.id}`}>
              <span className="alt">{data.name}</span>
            </Link>
            {" by "}
            {data.user_name ? (
              <Link to={`/user/${data.user_name}`}>{data.user_name}</Link>
            ) : (
              "Unknown"
            )}
          </p>
          {imgUrl && (
            <div className="coverImage">
              <img src={imgUrl} />
            </div>
          )}
          <p>Category: {category}</p>
          <p className="desc">
            {data.description
              ? `Template description: ${data.description}`
              : `Create your own top list using this template`}
          </p>
        </>
      )}
    </div>
  );
}

export default TemplateInfo;
