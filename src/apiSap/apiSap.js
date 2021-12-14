// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();
const db = require("../db/db");
const axios = require('axios');
let apiSap = (url, params,method) => {
    return new Promise((resolve, reject) => {
        try {
            // let api = await db.query(`select api from prm."API" WHERE "api_key"='getPrice'`);
            // if (api.rows.length > 0) {
                var username = 'quynhbc';
                var password = 'C0ngquynh96';

                const options = {
                    method: `${method}`,
                    auth: {
                        username: username,
                        password: password
                    },
                    timeout: 3000,
                    headers: {
                        xsrfCookieName: 'XSRF-TOKEN',
                        xsrfHeaderName: 'X-XSRF-TOKEN',
                        "X-XSRF-TOKEN": 'ZoJgPjA294f2JdEV1bLyzQ==',
                        "x-csrf-token": 'Fetch',
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: params
                    ,
                    url: `${url}`,
                };
                const data = axios(options);
                resolve(data);
            // }
        } catch (error) {
            return reject(error);
        }
    });
}
module.exports = {
    apiSap: apiSap,
}