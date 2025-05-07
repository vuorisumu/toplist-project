export const BASE_URL = "https://toplistmaker.onrender.com/api";

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
