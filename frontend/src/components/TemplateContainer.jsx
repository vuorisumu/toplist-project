import { useState, useEffect } from "react";
import { fetchAllTemplatesFiltered, fetchTemplateCount } from "./api";
import { formatData, getCountFromData } from "../util/dataHandler";
import Template from "./Template";

function TemplateContainer() {
  const [templates, setTemplates] = useState([]);
  const defaultQuery = "sortBy=id&sortOrder=desc";
  const [filters, setFilters] = useState(defaultQuery);
  const [templateCount, setTemplateCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const loadMoreAmount = 1;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplateCount();
  }, []);

  useEffect(() => {
    if (templateCount > 0) {
      loadTemplates();
    }
  }, [templateCount]);

  /**
   * Fetches the full count of templates in the database and sets it to state.
   */
  const getTemplateCount = async () => {
    fetchTemplateCount()
      .then((data) => {
        setTemplateCount(getCountFromData(data));
      })
      .catch((err) => console.log(err));
  };

  /**
   * Loads a set amount of templates from the database. By default this function
   * makes a new fetch that overwrites the previously fetched templates, but can
   * also be used to load more with the same given filters.
   *
   * @param {boolean} loadMore False by default, meaning the function will overwrite
   * previously fetched templates. When set to true, loads more templates with the
   * same filters.
   */
  const loadTemplates = async (loadMore = false) => {
    if (!loadMore) {
      setLoadedCount(0);
    }

    // Don't fetch more than the database has
    let newLoadSize = loadMoreAmount;
    if (loadedCount + loadMoreAmount > templateCount) {
      console.log(`${loadedCount} + ${loadMoreAmount} > ${templateCount}`);
      const overFlow = loadedCount + loadMoreAmount - templateCount;
      newLoadSize -= overFlow;
    }

    fetchAllTemplatesFiltered(
      `${filters}&from=${loadedCount}&amount=${newLoadSize}`
    )
      .then((data) => {
        const formattedData = formatData(data);
        if (loadedCount === 0) {
          setTemplates(formattedData);
          setLoading(false);
        } else {
          setTemplates((prevTemplates) => [...prevTemplates, ...formattedData]);
        }
        setLoadedCount(loadedCount + newLoadSize);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div>
        <h2>Recent templates</h2>
        {!loading && templates.length < 1 && <p>No templates found</p>}
        {loading ? (
          <p>Loading</p>
        ) : (
          <ul className="lists">
            {templates.map((template) => (
              <li key={template.id} className="template">
                <Template data={template} />
              </li>
            ))}
          </ul>
        )}

        {/* Load more button */}
        {templates.length > 0 && loadedCount < templateCount && (
          <button
            type="button"
            onClick={() => loadTemplates(true)}
            className="loadMoreButton"
          >
            Load more
          </button>
        )}
      </div>
    </>
  );
}

export default TemplateContainer;
