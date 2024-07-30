import { Link } from "react-router-dom";
import { formatDate } from "../util/misc";
import ButtonPrompt from "./ButtonPrompt";
import { isAdmin } from "../util/permissions";
import { deleteToplist } from "../api/toplists";
import { useEffect, useState } from "react";
import { getItemImages } from "../util/imageHandler";

/**
 * Reusable component displaying top list data.
 *
 * @param {object} props.data - Top list data to be displayed
 * @param {boolean} props.showTemplate - whether the top list should display
 * information about the template or no.
 * @param {boolean} props.showCreator - whether to display the creator name,
 * true by default
 * @returns {JSX.Element} Top list preview component
 */
function ToplistData({ data, showTemplate, showCreator }) {
  const [itemImages, setItemImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.ranked_items[0].img_id) {
      const imageIds = [];
      data.ranked_items.map((i) => {
        imageIds.push(i.img_id);
      });
      getImages(imageIds);
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Gets all images with the given IDs from the database and set them to state.
   *
   * @param {Array} imageIds - Array of image IDs
   */
  const getImages = async (imageIds) => {
    const fetchedImages = await getItemImages(imageIds);
    setItemImages(fetchedImages);
    setLoading(false);
  };

  /**
   * Deletes the top list from the database.
   */
  const handleDelete = () => {
    deleteToplist(data.toplist_id)
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showCreator && (
        <p>
          List creator:{" "}
          {data.user_name ? (
            <Link to={`/user/${data.user_name}`}>{data.user_name}</Link>
          ) : (
            "Anonymous"
          )}
        </p>
      )}

      {showTemplate && (
        <p>
          Template:{" "}
          {data.name ? (
            <Link to={`/createlist/${data.template_id}`}>{data.name}</Link>
          ) : (
            "[Deleted]"
          )}
        </p>
      )}
      <p>Creation time: {formatDate(data.creation_time)}</p>
      {data.toplist_desc && <p>{data.toplist_desc}</p>}

      <ol className="rank">
        {data.ranked_items.map((item, index) => (
          <li key={`${data.toplist_id} ${item.rank_number}`}>
            {item.img_id && (
              <div className="itemImage">
                {itemImages[index]?.name ? (
                  <img src={URL.createObjectURL(itemImages[index])} />
                ) : itemImages[index]?.img_url ? (
                  <img src={itemImages[index].img_url} />
                ) : (
                  <p>Loading</p>
                )}
              </div>
            )}
            <p>{item.item_name}</p>
            {item.item_note && <p className="itemNote">{item.item_note}</p>}
          </li>
        ))}
      </ol>

      {isAdmin() && (
        <ButtonPrompt
          buttonName="Delete top list"
          confirm={() => handleDelete(data.toplist_id)}
        />
      )}
    </>
  );
}

export default ToplistData;
