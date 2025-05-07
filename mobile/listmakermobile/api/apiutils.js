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

export const fetchAndFormat = (endpoint) => {
    return fetch(`${BASE_URL}${endpoint}`)
        .then((response) => response.json())
        .then((data) => formatData(data));
};
