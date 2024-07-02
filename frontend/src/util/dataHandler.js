import { fetchTemplateNamesByInput } from "../api/templates";
import { fetchListNamesByInput } from "../api/toplists";
import { fetchUserNamesByInput } from "../api/users";

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

export const getTemplateCreatorIdFromData = (data) => {
  const formattedData = formatData(data);
  if (
    formattedData.length > 0 &&
    formattedData[0].hasOwnProperty("creator_id")
  ) {
    return parseInt(formattedData[0].creator_id);
  }
  return 0;
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

export const fetchCombinedToplistNamesByInput = async (input) => {
  try {
    const [topListNameData, userNameData] = await Promise.all([
      fetchListNamesByInput(input),
      fetchUserNamesByInput(input),
    ]);

    const topListNames = getTemplateNamesFromData(topListNameData);
    const userNames = getTemplateNamesFromData(userNameData);

    return [...topListNames, ...userNames];
  } catch (err) {
    console.log(err);
  }
};
