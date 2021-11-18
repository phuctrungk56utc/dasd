"use strict";

var jwt = require('jsonwebtoken');

var db = require("../db/db");

var crypt = require("../crypt/crypt");

var decodeJWT = require('jwt-decode');

var accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
var accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH;
var accessToken = undefined;
var decodeTk = undefined;
var refreshToken = undefined;

var verifyToken = function verifyToken(req, res, next) {
  try {
    accessToken = crypt.decrypt(req.body.accessToken);
    decodeTk = decodeJWT(accessToken);
    jwt.verify(accessToken, accessTokenSecretAccess, function (error, decoded) {
      if (error && error.message === 'jwt expired') {
        db.query("SELECT \"roles\".\"releaseType\",\"users\".\"refreshToken\",\"users\".\"userId\",\"roles\".\"roleId\",\"roles\".\"functionView\",\"roles\".\"functionCreateEditDelete\", \"roles\".\"functionApprove\", \"roles\".\"functionAll\",\n                \"userrole\".\"roleId\"\n                FROM prm.users users \n                INNER JOIN prm.\"userRole\" userrole ON \"users\".\"userId\" = \"userrole\".\"userId\"\n                INNER JOIN prm.roles roles ON \"roles\".\"roleId\" = \"userrole\".\"roleId\"  \n                WHERE \"users\".\"userId\" = '".concat(decodeTk.userId, "'"), function (err, resp) {
          if (err) {
            return res.status(500).json({
              database: err
            });
          }

          try {
            refreshToken = crypt.decrypt(resp.rows[0].refreshToken); // if(resp.rows[0].accessToken === req.body.accessToken){

            jwt.verify(refreshToken, accessTokenSecretRefresh, function (error, decoded) {
              if (error) {
                // return reject(error);
                return res.status(403).json({
                  message: 'refreshToken is old'
                });
              } else {
                // resolve(decoded);
                var DbAccessTK = jwt.sign({
                  "userId": resp.rows[0].userId.toUpperCase(),
                  key: process.env.CIBER_PRM_KEY_PRIVATE
                }, accessTokenSecretAccess, {
                  expiresIn: '30s'
                });

                var _accessToken = crypt.encrypt(DbAccessTK);

                var vRole = resp.rows;

                for (var property in resp.rows) {
                  // console.log(`${property}: ${object[property]}`);
                  delete vRole[property].refreshToken;
                } // resp.rows.forEach((index) => {
                //     delete resp.rows[index].RefreshToKent;
                // });


                return res.status(200).json({
                  accessToken: _accessToken,
                  role: vRole
                }); // call refresh token
                // next();
              }
            }); //  }else{
            //     return res.status(404).json({toKent:'token is old'});
            //  }
          } catch (error) {
            // console.log(error)
            return res.status(404).json(error);
          }
        });
      } else {
        db.query("SELECT \"roles\".\"releaseType\",\"users\".\"userId\",\"roles\".\"roleId\",\"roles\".\"functionView\",\"roles\".\"functionCreateEditDelete\", \"roles\".\"functionApprove\", \"roles\".\"functionAll\",\n                \"userrole\".\"roleId\"\n                FROM prm.users users \n                INNER JOIN prm.\"userRole\" userrole ON \"users\".\"userId\" = \"userrole\".\"userId\"\n                INNER JOIN prm.roles roles ON \"roles\".\"roleId\" = \"userrole\".\"roleId\"  \n                WHERE \"users\".\"userId\" = '".concat(decodeTk.userId, "'"), function (err, resp) {
          if (err) {
            return res.status(500).json({
              database: err
            });
          } else {
            return res.status(200).json({
              accessToken: null,
              role: resp.rows
            });
          }
        });
      } // resolve(decoded);

    });
  } catch (error) {
    return res.status(401).json({
      database: error
    });
  }
};

module.exports = verifyToken;