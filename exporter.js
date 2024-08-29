const XLSX = require('xlsx');
const { exportFilename } = require('./config');

const exportToExcel = (data, filename = exportFilename) => {
    const workbook = XLSX.utils.book_new();
    const formattedData = data.map(asset => ({
        ...asset,
        imageUrls: asset.imageUrls.join(', ')
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
    XLSX.writeFile(workbook, filename);
};

module.exports = {
    exportToExcel
};
