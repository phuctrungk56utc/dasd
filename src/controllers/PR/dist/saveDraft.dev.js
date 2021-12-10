"use strict";

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode'); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db"); // const axios = require('axios');

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var saveDraft = function saveDraft(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, _dataItem, leng, queryHeader, update, stringValue, i, stringValueChiden, _dataItem2, _leng, query, id, _i, updateTableItem, _leng2, _i2;

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
            _context.next = 25;
            break;
          }

          //update
          _dataItem = req.body.params.dataPR.ITEM;
          leng = _dataItem.length;

          if (!(leng === 0)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 8:
          queryHeader = "UPDATE prm.\"PrTable\"\n            SET\n            \"DESCRIPTION\" = '".concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n            \"BUKRS\" = '").concat(req.body.params.dataPR.HEADER.BUKRS, "',\n            \"PR_TYPE\" = '").concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n            \"WAERS\" = '").concat(req.body.params.dataPR.HEADER.WAERS === undefined ? '' : req.body.params.dataPR.HEADER.WAERS, "',\n            \"HWAERS\" = '").concat(req.body.params.dataPR.HEADER.HWAERS === undefined ? '' : req.body.params.dataPR.HEADER.HWAERS, "',\n            \"changeAt\"=now(),\n            \"changeBy\"='").concat(userId, "'\n            WHERE \"PR_NO\"=").concat(req.body.params.dataPR.HEADER.PR_NO, "\n            RETURNING \"changeAt\";");
          _context.next = 11;
          return regeneratorRuntime.awrap(db.query("".concat(queryHeader)));

        case 11:
          update = _context.sent;

          if (!(update.rowCount > 0)) {
            _context.next = 22;
            break;
          }

          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_ITEM\",\"PR_NO\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";

          for (i in _dataItem) {
            _dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(_dataItem[i].PR_ITEM, "','").concat(_dataItem[i].PR_NO, "','").concat(_dataItem[i].KNTTP, "','").concat(_dataItem[i].PSTYP, "','").concat(_dataItem[i].MATNR, "','").concat(_dataItem[i].MATKL, "','").concat(_dataItem[i].TXZ01, "'\n                        ,'").concat(_dataItem[i].WERKS, "','").concat(_dataItem[i].LGORT, "','").concat(_dataItem[i].LFDAT, "','").concat(_dataItem[i].LIFNR, "','").concat(_dataItem[i].MENGE, "','").concat(_dataItem[i].MEINS, "','").concat(_dataItem[i].PREIS, "'\n                        ,'").concat(_dataItem[i].WEARS, "','").concat(_dataItem[i].PEINH, "','").concat(_dataItem[i].GSWRT, "','").concat(_dataItem[i].LOCAL_AMOUNT, "','").concat(_dataItem[i].EBELN, "','").concat(_dataItem[i].EBELP, "','").concat(_dataItem[i].LOEKZ, "'\n                        ,'").concat(_dataItem[i].EKORG, "','").concat(_dataItem[i].EKGRP, "','").concat(_dataItem[i].WEPOS, "','").concat(_dataItem[i].WEUNB, "','").concat(_dataItem[i].BLCKD, "','").concat(_dataItem[i].REPOS, "','").concat(_dataItem[i].BLCKT, "'\n                        ,'").concat(_dataItem[i].SAKTO, "','").concat(_dataItem[i].KOSTL, "','").concat(_dataItem[i].PRCTR, "','").concat(_dataItem[i].ANLN1, "','").concat(_dataItem[i].ANLN2, "','").concat(_dataItem[i].AUFNR, "','").concat(_dataItem[i].GSBER, "'\n                        ,'").concat(_dataItem[i].KOKRS, "','").concat(_dataItem[i].GEBER, "','").concat(_dataItem[i].FIPOS, "','").concat(_dataItem[i].FKBER, "','").concat(_dataItem[i].FISTL, "','").concat(_dataItem[i].INFNR, "')");

            if (leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue)));

        case 19:
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

        case 22:
          return _context.abrupt("return", res.status(200).json({
            message: 'Cập nhật thất bại!'
          }));

        case 23:
          _context.next = 39;
          break;

        case 25:
          //insert
          _dataItem2 = req.body.params.dataPR.ITEM;
          _leng = _dataItem2.length;

          if (!(_leng === 0)) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 29:
          query = "INSERT INTO prm.\"PrTable\" (\"PR_TYPE\",\"BUKRS\", \"WAERS\",\"HWAERS\",\"DESCRIPTION\",\"createBy\",\"changeBy\")\n            VALUES ('".concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n                '").concat(req.body.params.dataPR.HEADER.BUKRS, "',\n                '").concat(req.body.params.dataPR.HEADER.WAERS, "',\n                '").concat(req.body.params.dataPR.HEADER.HWAERS, "',\n                '").concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n                '").concat(userId, "','").concat(userId, "')\n                RETURNING \"PR_NO\",\"changeAt\";");
          _context.next = 32;
          return regeneratorRuntime.awrap(db.query(query));

        case 32:
          id = _context.sent;
          // const dataItem = req.body.params.dataPR.ITEM;
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_ITEM\",\"PR_NO\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES"; // const leng = dataItem.length

          for (_i in _dataItem2) {
            _dataItem2[_i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(_dataItem2[_i].PR_ITEM, "','").concat(id.rows[0].PR_NO, "','").concat(_dataItem2[_i].KNTTP, "','").concat(_dataItem2[_i].PSTYP, "','").concat(_dataItem2[_i].MATNR, "','").concat(_dataItem2[_i].MATKL, "','").concat(_dataItem2[_i].TXZ01, "'\n                        ,'").concat(_dataItem2[_i].WERKS, "','").concat(_dataItem2[_i].LGORT, "','").concat(_dataItem2[_i].LFDAT, "','").concat(_dataItem2[_i].LIFNR, "','").concat(_dataItem2[_i].MENGE, "','").concat(_dataItem2[_i].MEINS, "','").concat(_dataItem2[_i].PREIS, "'\n                        ,'").concat(_dataItem2[_i].WEARS, "','").concat(_dataItem2[_i].PEINH, "','").concat(_dataItem2[_i].GSWRT, "','").concat(_dataItem2[_i].LOCAL_AMOUNT, "','").concat(_dataItem2[_i].EBELN, "','").concat(_dataItem2[_i].EBELP, "','").concat(_dataItem2[_i].LOEKZ, "'\n                        ,'").concat(_dataItem2[_i].EKORG, "','").concat(_dataItem2[_i].EKGRP, "','").concat(_dataItem2[_i].WEPOS, "','").concat(_dataItem2[_i].WEUNB, "','").concat(_dataItem2[_i].BLCKD, "','").concat(_dataItem2[_i].REPOS, "','").concat(_dataItem2[_i].BLCKT, "'\n                        ,'").concat(_dataItem2[_i].SAKTO, "','").concat(_dataItem2[_i].KOSTL, "','").concat(_dataItem2[_i].PRCTR, "','").concat(_dataItem2[_i].ANLN1, "','").concat(_dataItem2[_i].ANLN2, "','").concat(_dataItem2[_i].AUFNR, "','").concat(_dataItem2[_i].GSBER, "'\n                        ,'").concat(_dataItem2[_i].KOKRS, "','").concat(_dataItem2[_i].GEBER, "','").concat(_dataItem2[_i].FIPOS, "','").concat(_dataItem2[_i].FKBER, "','").concat(_dataItem2[_i].FISTL, "','").concat(_dataItem2[_i].INFNR, "')");

            if (_leng > Number(_i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          } // await db.query(`DELETE FROM prm."PrItem"
          // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);


          _context.next = 37;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, " RETURNING \"id\";")));

        case 37:
          updateTableItem = _context.sent;
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

        case 39:
          _context.next = 49;
          break;

        case 41:
          _context.prev = 41;
          _context.t0 = _context["catch"](0);
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n        \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n        \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng2 = dataItem.length;

          for (_i2 in dataItem) {
            dataItem[_i2]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i2].PR_NO, "','").concat(dataItem[_i2].PR_ITEM, "','").concat(dataItem[_i2].KNTTP, "','").concat(dataItem[_i2].PSTYP, "','").concat(dataItem[_i2].MATNR, "','").concat(dataItem[_i2].MATKL, "','").concat(dataItem[_i2].TXZ01, "'\n                ,'").concat(dataItem[_i2].WERKS, "','").concat(dataItem[_i2].LGORT, "','").concat(dataItem[_i2].LFDAT, "','").concat(dataItem[_i2].LIFNR, "','").concat(dataItem[_i2].MENGE, "','").concat(dataItem[_i2].MEINS, "','").concat(dataItem[_i2].PREIS, "'\n                ,'").concat(dataItem[_i2].WEARS, "','").concat(dataItem[_i2].PEINH, "','").concat(dataItem[_i2].GSWRT, "','").concat(dataItem[_i2].LOCAL_AMOUNT, "','").concat(dataItem[_i2].EBELN, "','").concat(dataItem[_i2].EBELP, "','").concat(dataItem[_i2].LOEKZ, "'\n                ,'").concat(dataItem[_i2].EKORG, "','").concat(dataItem[_i2].EKGRP, "','").concat(dataItem[_i2].WEPOS, "','").concat(dataItem[_i2].WEUNB, "','").concat(dataItem[_i2].BLCKD, "','").concat(dataItem[_i2].REPOS, "','").concat(dataItem[_i2].BLCKT, "'\n                ,'").concat(dataItem[_i2].SAKTO, "','").concat(dataItem[_i2].KOSTL, "','").concat(dataItem[_i2].PRCTR, "','").concat(dataItem[_i2].ANLN1, "','").concat(dataItem[_i2].ANLN2, "','").concat(dataItem[_i2].AUFNR, "','").concat(dataItem[_i2].GSBER, "'\n                ,'").concat(dataItem[_i2].KOKRS, "','").concat(dataItem[_i2].GEBER, "','").concat(dataItem[_i2].FIPOS, "','").concat(dataItem[_i2].FKBER, "','").concat(dataItem[_i2].FISTL, "','").concat(dataItem[_i2].INFNR, "')");

            if (_leng2 > Number(_i2) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 48;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 48:
          return _context.abrupt("return", res.status(404).json({
            message: err.message
          }));

        case 49:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 41]]);
};

module.exports = {
  saveDraft: saveDraft
};