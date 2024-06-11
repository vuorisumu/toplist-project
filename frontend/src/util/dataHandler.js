export const formatData = (data) => {
  if (data != null) {
    console.log("formatting data");
    const formattedData = [];
    data.rows.forEach((row) => {
      const formattedDataRow = {};
      data.metaData.forEach((column, index) => {
        const columnName = column.name.toLowerCase();
        formattedDataRow[columnName] = row[index];
      });
      formattedData.push(formattedDataRow);
    });
    return formattedData;
  }
  return null;
};
