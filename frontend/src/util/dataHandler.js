import {
  fetchRankingNamesByInput,
  fetchTagById,
  fetchTemplateNamesByInput,
  fetchUserNamesByInput,
} from "../components/api";

export const formatData = (data) => {
  if (data && data.rows && data.metaData) {
    const formattedData = data.rows.map((row) => {
      const formattedDataRow = {};
      data.metaData.forEach((column, index) => {
        const columnName = column.name.toLowerCase();
        formattedDataRow[columnName] = row[index];
      });
      return formattedDataRow;
    });
    return formattedData;
  }
  return [];
};

export const getCountFromData = (data) => {
  const formattedData = formatData(data);
  if (formattedData.length > 0 && formattedData[0].hasOwnProperty("count")) {
    return parseInt(formattedData[0].count);
  }
  return 0;
};

export const tagNamesByIds = async (tagNumbers) => {
  const tagNames = [];
  try {
    await Promise.all(
      tagNumbers.map(async (t) => {
        const fetchedTag = await fetchTagById(parseInt(t));
        const formattedTags = formatData(fetchedTag);
        let tagName;
        if (formattedTags.length > 0) {
          tagName = formattedTags[0].name;
        }
        tagNames.push(tagName);
      })
    );
    return tagNames;
  } catch (err) {
    console.error(err);
  }
};

export const getTemplateNamesFromData = (data) => {
  const formattedData = formatData(data);
  if (formattedData.length > 0) {
    if (formattedData[0].hasOwnProperty("name"))
      return formattedData.map((template) => template.name);
    else if (formattedData[0].hasOwnProperty("user_name"))
      return formattedData.map((user) => user.user_name);
    else if (formattedData[0].hasOwnProperty("toplist_name"))
      return formattedData.map((list) => list.toplist_name);
  }
  return [];
};

export const fetchAllNamesByInput = async (input) => {
  try {
    const [templateNameData, userNameData] = await Promise.all([
      fetchTemplateNamesByInput(input),
      fetchUserNamesByInput(input),
    ]);

    const templateNames = getTemplateNamesFromData(templateNameData);
    const userNames = getTemplateNamesFromData(userNameData);

    return [...templateNames, ...userNames];
  } catch (err) {
    console.log(err);
  }
};
