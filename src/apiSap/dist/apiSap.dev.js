"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();

var db = require("../db/db");

var axios = require('axios');

var apiSap = function apiSap(url, params, method) {
  return new Promise(function (resolve, reject) {
    try {
      // let api = await db.query(`select api from prm."API" WHERE "api_key"='getPrice'`);
      // if (api.rows.length > 0) {
      var username = 'giangph';
      var password = '1234567';
      var options = {
        method: "".concat(method),
        auth: {
          username: username,
          password: password
        },
        headers: {
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          "X-XSRF-TOKEN": 'ZoJgPjA294f2JdEV1bLyzQ==',
          "x-csrf-token": 'Fetch',
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: params,
        url: "".concat(url)
      };
      var data = axios(options);
      resolve(data); // }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  apiSap: apiSap
};