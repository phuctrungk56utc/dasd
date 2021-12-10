"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();

var crypt = require("../../../crypt/crypt");

var decodeJWT = require('jwt-decode'); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../../db/db"); // const axios = require('axios');

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var saveDraft = function saveDraft(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, dataItem, leng, query, update, stringValue, i, stringValueChiden, _dataItem, _leng, _query, id, _i;

  return regeneratorRuntime.async(function saveDraft$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0].toUpperCase();
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
          }

          if (!(req.body.params.dataPR.HEADER.PR_NO !== 0)) {
            _context.next = 23;
            break;
          }

          //update
          dataItem = req.body.params.dataPR.ITEM;
          leng = dataItem.length;

          if (!(leng === 0)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 8:
          query = "UPDATE prm.\"PrTable\"\n            SET\n            \"DESCRIPTION\" = '".concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n            \"BUKRS\" = '").concat(req.body.params.dataPR.HEADER.BUKRS, "',\n            \"PR_TYPE\" = '").concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n            \"WAERS\" = '").concat(req.body.params.dataPR.HEADER.WAERS === undefined ? '' : req.body.params.dataPR.HEADER.WAERS, "',\n            \"HWAERS\" = '").concat(req.body.params.dataPR.HEADER.HWAERS === undefined ? '' : req.body.params.dataPR.HEADER.HWAERS, "',\n            \"changeAt\"=now(),\n            \"changeBy\"='").concat(userId, "'\n            WHERE \"PR_NO\"=").concat(req.body.params.dataPR.HEADER.PR_NO, "\n            RETURNING \"changeAt\";");
          _context.next = 11;
          return regeneratorRuntime.awrap(db.query(query));

        case 11:
          update = _context.sent;

          if (!(update.rowCount > 0)) {
            _context.next = 20;
            break;
          }

          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\") VALUES";

          for (i in dataItem) {
            dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[i].PR_NO, "','").concat(dataItem[i].KNTTP, "','").concat(dataItem[i].PSTYP, "','").concat(dataItem[i].MATNR, "','").concat(dataItem[i].MATKL, "','").concat(dataItem[i].TXZ01, "'\n                        ,'").concat(dataItem[i].WERKS, "','").concat(dataItem[i].LGORT, "','").concat(dataItem[i].LFDAT, "','").concat(dataItem[i].LIFNR, "','").concat(dataItem[i].MENGE, "','").concat(dataItem[i].MEINS, "','").concat(dataItem[i].PREIS, "'\n                        ,'").concat(dataItem[i].WEARS, "','").concat(dataItem[i].PEINH, "','").concat(dataItem[i].GSWRT, "','").concat(dataItem[i].LOCAL_AMOUNT, "','").concat(dataItem[i].EBELN, "','").concat(dataItem[i].EBELP, "','").concat(dataItem[i].LOEKZ, "'\n                        ,'").concat(dataItem[i].EKORG, "','").concat(dataItem[i].EKGRP, "','").concat(dataItem[i].WEPOS, "','").concat(dataItem[i].WEUNB, "','").concat(dataItem[i].BLCKD, "','").concat(dataItem[i].REPOS, "','").concat(dataItem[i].BLCKT, "'\n                        ,'").concat(dataItem[i].SAKTO, "','").concat(dataItem[i].KOSTL, "','").concat(dataItem[i].PRCTR, "','").concat(dataItem[i].ANLN1, "','").concat(dataItem[i].ANLN2, "','").concat(dataItem[i].AUFNR, "','").concat(dataItem[i].GSBER, "'\n                        ,'").concat(dataItem[i].KOKRS, "','").concat(dataItem[i].GEBER, "','").concat(dataItem[i].FIPOS, "','").concat(dataItem[i].FKBER, "','").concat(dataItem[i].FISTL, "')");

            if (leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          } // await db.query(`DELETE FROM prm."PrItem"
          // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);


          _context.next = 17;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";").concat(stringValue, ";")));

        case 17:
          return _context.abrupt("return", res.status(200).json({
            message: 'success',
            dataHeader: {
              changeAt: update.rows[0].changeAt,
              PR_TYPE: req.body.params.dataPR.HEADER.PR_TYPE,
              BUKRS: req.body.params.dataPR.HEADER.BUKRS,
              createBy: userId,
              PR_NO: req.body.params.dataPR.HEADER.PR_NO,
              DESCRIPTION: req.body.params.dataPR.HEADER.DESCRIPTION,
              STATUS: 1
            }
          }));

        case 20:
          return _context.abrupt("return", res.status(200).json({
            message: 'Cập nhật thất bại!'
          }));

        case 21:
          _context.next = 36;
          break;

        case 23:
          //insert
          _dataItem = req.body.params.dataPR.ITEM;
          _leng = _dataItem.length;

          if (!(_leng === 0)) {
            _context.next = 27;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 27:
          _query = "INSERT INTO prm.\"PrTable\" (\"PR_TYPE\",\"BUKRS\", \"WAERS\",\"HWAERS\",\"DESCRIPTION\",\"createBy\",\"changeBy\")\n            VALUES ('".concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n                '").concat(req.body.params.dataPR.HEADER.BUKRS, "',\n                '").concat(req.body.params.dataPR.HEADER.WAERS, "',\n                '").concat(req.body.params.dataPR.HEADER.HWAERS, "',\n                '").concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n                '").concat(userId, "','").concat(userId, "')\n                RETURNING \"PR_NO\",\"changeAt\";");
          _context.next = 30;
          return regeneratorRuntime.awrap(db.query(_query));

        case 30:
          id = _context.sent;
          // const dataItem = req.body.params.dataPR.ITEM;
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\") VALUES"; // const leng = dataItem.length

          for (_i in _dataItem) {
            _dataItem[_i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(id.rows[0].PR_NO, "','").concat(_dataItem[_i].KNTTP, "','").concat(_dataItem[_i].PSTYP, "','").concat(_dataItem[_i].MATNR, "','").concat(_dataItem[_i].MATKL, "','").concat(_dataItem[_i].TXZ01, "'\n                        ,'").concat(_dataItem[_i].WERKS, "','").concat(_dataItem[_i].LGORT, "','").concat(_dataItem[_i].LFDAT, "','").concat(_dataItem[_i].LIFNR, "','").concat(_dataItem[_i].MENGE, "','").concat(_dataItem[_i].MEINS, "','").concat(_dataItem[_i].PREIS, "'\n                        ,'").concat(_dataItem[_i].WEARS, "','").concat(_dataItem[_i].PEINH, "','").concat(_dataItem[_i].GSWRT, "','").concat(_dataItem[_i].LOCAL_AMOUNT, "','").concat(_dataItem[_i].EBELN, "','").concat(_dataItem[_i].EBELP, "','").concat(_dataItem[_i].LOEKZ, "'\n                        ,'").concat(_dataItem[_i].EKORG, "','").concat(_dataItem[_i].EKGRP, "','").concat(_dataItem[_i].WEPOS, "','").concat(_dataItem[_i].WEUNB, "','").concat(_dataItem[_i].BLCKD, "','").concat(_dataItem[_i].REPOS, "','").concat(_dataItem[_i].BLCKT, "'\n                        ,'").concat(_dataItem[_i].SAKTO, "','").concat(_dataItem[_i].KOSTL, "','").concat(_dataItem[_i].PRCTR, "','").concat(_dataItem[_i].ANLN1, "','").concat(_dataItem[_i].ANLN2, "','").concat(_dataItem[_i].AUFNR, "','").concat(_dataItem[_i].GSBER, "'\n                        ,'").concat(_dataItem[_i].KOKRS, "','").concat(_dataItem[_i].GEBER, "','").concat(_dataItem[_i].FIPOS, "','").concat(_dataItem[_i].FKBER, "','").concat(_dataItem[_i].FISTL, "')");

            if (_leng > Number(_i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          } // await db.query(`DELETE FROM prm."PrItem"
          // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);


          _context.next = 35;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 35:
          return _context.abrupt("return", res.status(200).json({
            message: 'success',
            dataHeader: {
              PR_NO: id.rows[0].PR_NO,
              ACTION_CODE: 1,
              createBy: userId,
              changeAt: id.rows[0].changeAt,
              STATUS: 1,
              PR_TYPE: req.body.params.dataPR.HEADER.PR_TYPE,
              BUKRS: req.body.params.dataPR.HEADER.BUKRS,
              DESCRIPTION: req.body.params.dataPR.HEADER.DESCRIPTION
            }
          }));

        case 36:
          _context.next = 41;
          break;

        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: err.message
          }));

        case 41:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 38]]);
};

module.exports = {
  saveDraft: saveDraft
};