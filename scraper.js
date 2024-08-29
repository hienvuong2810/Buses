const axios = require('axios');
const cheerio = require('cheerio');
const { baseUrl } = require('./config');

const getLastPage = async () => {
    try {
        const { data } = await axios.get(`${baseUrl}/buses/`);
        const $ = cheerio.load(data);
        const paginationLinks = $('.pagination .page-link');
        let lastPageNumber = 1;

        paginationLinks.each((index, element) => {
            const pageText = $(element).text().trim();
            const pageNumber = parseInt(pageText, 10);
            if (!isNaN(pageNumber) && pageNumber > lastPageNumber) {
                lastPageNumber = pageNumber;
            }
        });

        return lastPageNumber;
    } catch (error) {
        console.error('Error fetching the last page:', error);
        return 1;
    }
};

const getAllAssetUrls = async () => {
    try {
        const lastPage = await getLastPage();
        console.log(`Last page number: ${lastPage}`);

        let assetUrls = [];

        for (let i = 1; i <= lastPage; i++) {
            const pageUrl = `${baseUrl}/buses/?page=${i}`;
            const { data } = await axios.get(pageUrl);
            const $ = cheerio.load(data);

            $('a.listing').each((index, element) => {
                const assetUrl = $(element).attr('href');
                if (assetUrl) {
                    assetUrls.push(assetUrl.startsWith('http') ? assetUrl : `${baseUrl}${assetUrl}`);
                }
            });

            console.log(`Fetched ${assetUrls.length} URLs from page ${i}`);
        }

        console.log(`Total asset URLs: ${assetUrls.length}`);
        return assetUrls;
    } catch (error) {
        console.error('Error fetching asset URLs:', error);
        return [];
    }
};

const getAssetDetails = async (assetUrl) => {
    try {
        const { data } = await axios.get(assetUrl);
        const $ = cheerio.load(data);

        const assetName = $('h1.title').text().trim();
        const imageUrls = [];
        $('.carousel-inner .carousel-item').each((index, element) => {
            const style = $(element).attr('style');
            const match = style.match(/url\(([^)]+)\)/);
            if (match && match[1]) {
                imageUrls.push(match[1].startsWith('http') ? match[1] : `${baseUrl}${match[1]}`);
            }
        });

        const price = $('#summary .price').text().replace('Price: ', '').trim();
        const type = $('#summary .detail.type + dd').text().trim();
        const history = $('#summary .detail.history + dd').text().trim();
        const mileage = $('#summary .detail.mileage + dd').text().trim();
        const location = $('#summary .detail.location + dd').text().trim();
        const passengers = $('#summary .detail.passengers + dd').text().trim();
        const description = $('#description').text().trim();
        const additionalFeatures = $('#additional-features').text().trim();

        const contactDiv = $('.sb-contact');
        const contactEmail = contactDiv.find('.sb-contact_email').text().trim();
        const contactPhone = contactDiv.find('.sb-contact_phone').text().trim();
        const contactName = contactDiv.find('.sb-contact_name').text().trim();

        return {
            assetName,
            assetUrl,
            imageUrls,
            price,
            type,
            history,
            mileage,
            location,
            passengers,
            description,
            additionalFeatures,
            contactEmail,
            contactPhone,
            contactName
        };
    } catch (error) {
        console.error(`Error fetching details from ${assetUrl}:`, error);
        return null;
    }
};

module.exports = {
    getAllAssetUrls,
    getAssetDetails
};
