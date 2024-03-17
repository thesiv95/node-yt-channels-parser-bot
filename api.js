const axios = require("axios").default;

const baseURL = "https://www.googleapis.com/youtube/v3/search";

/**
 * @param {string} channelUsername
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
exports.getChannelId = async (channelUsername, apiKey) => {
  try {
    const url = `${baseURL}?part=snippet&q=${channelUsername}&key=${apiKey}&type=channel`;
    let response = await axios.get(url);
    response = response.data;
    return response.items[0].id.channelId;
  } catch (error) {
    console.log(error.stack);
    return error.message;
  }
};

/**
 * @param {string} channelId
 * @param {string} apiKey
 * @returns {Promise<[string]>}
 */
exports.getVideosList = async (channelId, apiKey) => {
  try {
    const url = `${baseURL}?channelId=${channelId}&order=date&part=snippet&type=video&maxResults=15&key=${apiKey}`;
    let response = await axios.get(url);
    response = response.data;

    const { items } = response;

    const mappedItems = items.map((item, index) => {
      return `<b>${index + 1}. ${item.snippet.title}</b>\n${
        item.snippet.description
      }`;
    });
    return mappedItems;
  } catch (error) {
    console.log(error.stack);
    return [];
  }
};
