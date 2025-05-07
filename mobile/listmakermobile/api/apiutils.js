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

const getFilterQuery = (filters) => {
    const query = new URLSearchParams(filters);
    return `?${query.toString()}`;
};

export const fetchAndFormat = (endpoint, params = {}) => {
    const query = Object.keys(params).length ? getFilterQuery(params) : "";
    return fetch(`${BASE_URL}${endpoint}${query}`)
        .then((response) => response.json())
        .then((data) => formatData(data));
};
