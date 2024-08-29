const { getAllAssetUrls, getAssetDetails } = require('./scraper');
const { insertIntoMongoDB } = require('./db');
const { exportToExcel } = require('./exporter');

const getAssetList = async () => {
    try {
        const assetUrls = await getAllAssetUrls();
        const assetDetailsList = [];
        for (const assetUrl of assetUrls) {
            const details = await getAssetDetails(assetUrl);
            if (details) {
                assetDetailsList.push(details);
            }
        }

        console.log(`Total assets fetched: ${assetDetailsList.length}`);
        console.log(assetDetailsList)

        // Export to Excel
        exportToExcel(assetDetailsList);

        // Insert into MongoDB
        await insertIntoMongoDB(assetDetailsList);
    } catch (error) {
        console.error('Error in getAssetList:', error);
    }
};

// Run the main function
getAssetList();
