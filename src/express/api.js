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

  // аргумент - это объект со свойством comments
  // Если мы вообще ничего не передадим при вызове, то возникнет ошибка
  getOffers({comments} = {}) {
    // Получается в this._http.request аргумент выглядит так:
    // {`/offers`, params: {comments}}
    return this._load(`/offers`, {params: {comments}}); // ?????? Написать объяснение
  }

  getOffer(id, comments) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}}); // ?????? Написать объяснение
  }

  getCategories(count) {
    // Придумываем наименование "count", оно становится частью запроса
    // в виде: http://localhost:3001/api/categories?count=true
    return this._load(`/categories`, {params: {count}});
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
