export const formatData = (data) => {
  if (data && data.rows && data.metaData) {
    console.log("formatting data");
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
