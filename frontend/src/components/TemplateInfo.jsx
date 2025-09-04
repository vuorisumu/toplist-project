import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImgUrl } from "../util/imageHandler";
import { getCategoryById } from "../util/storage";

function TemplateInfo({ data }) {
    const [category, setCategory] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        if (data) {
            console.log(data);
            if (data.cover_image_url)
                setImgUrl(getImgUrl(data.cover_image_url));

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
                            <Link to={`/user/${data.user_name}`}>
                                {data.user_name}
                            </Link>
                        ) : (
                            "Unknown"
                        )}
                    </p>
                    {data.cover_image_url && (
                        <div className="coverImage">
                            <img src={data.cover_image_url} />
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
