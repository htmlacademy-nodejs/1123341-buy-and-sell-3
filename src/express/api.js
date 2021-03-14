'use strict';

const axios = require(`axios`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || 3001;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  // возьмет значение свойства comments из переданного объекта
  getOffers({comments}) {
    // params - параметры, отправленные в URL запросе от пользователя
    return this._load(`/offers`, {params: {comments}});
  }

  getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  search(query) {
    // в query попадает то, что вбито в поисковик
    return this._load(`/search`, {params: {query}});
  }

  async getCategories() {
    return this._load(`/categories`);
  }

  async createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
