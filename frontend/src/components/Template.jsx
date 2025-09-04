import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTemplate } from "../api/templates";
import { isAdmin, isCreatorOfTemplate } from "../util/permissions";
import { getCategoryById } from "../util/storage";
import ButtonPrompt from "./ButtonPrompt";

/**
 * Reusable component displaying a preview of a template
 *
 * @param {object} props.data - The data of the template
 * @param {boolean} props.showCreator - Whether to display creator name,
 * true by default
 * @returns {JSX.Element} Template preview component
 */
function Template({ data, showCreator = true, allowEdit = false }) {
    const [canEdit, setCanEdit] = useState(false);
    const [category, setCategory] = useState("");
    // const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        checkPermission();
        getCategoryById(data.category)
            .then((c) => setCategory(c))
            .catch((err) => console.log(err));

        // if (data.cover_image_url) {
        //     const url = getImgUrl(data.cover_image_url);
        //     setImgUrl(url);
        // }
    }, []);

    /**
     * Checks if the user is logged in as admin or is the creator of the
     * currently chosen template.
     */
    const checkPermission = async () => {
        try {
            const isCreator = await isCreatorOfTemplate(data.id);
            setCanEdit(isCreator);
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Deletes the chosen template from the database and refreshes
     */
    const handleDelete = () => {
        deleteTemplate(data.id)
            .then((res) => {
                console.log(res);
                window.location.reload(false);
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <Link to={`/templates/${data.id}`}>
                <h2>{data.name}</h2>{" "}
            </Link>

            {data.cover_image_url && (
                <div className="coverImage">
                    <img src={data.cover_image_url} />
                </div>
            )}

            <p>Category: {category}</p>
            {showCreator && (
                <p className="creator">
                    Creator:{" "}
                    {data.user_name ? (
                        <Link to={`/user/${data.user_name}`}>
                            {data.user_name}
                        </Link>
                    ) : (
                        "Anonymous"
                    )}
                </p>
            )}

            {data.description && (
                <p className="description">{data.description}</p>
            )}

            {(isAdmin() || (canEdit && allowEdit)) && (
                <div>
                    <Link to={`/edit-template/${data.id}`} className="edit">
                        <button type="button">Edit template</button>
                    </Link>

                    <ButtonPrompt
                        buttonName="Delete template"
                        confirm={() => handleDelete(data.id)}
                    />
                </div>
            )}
        </>
    );
}

export default Template;
