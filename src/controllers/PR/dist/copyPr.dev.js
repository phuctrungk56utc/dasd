"use strict";

require('dotenv').config();

var crypt = require("../../crypt/crypt");

var db = require("../../db/db");

var decodeJWT = require('jwt-decode');

var socIo = require("../../../server");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var copyPr = function copyPr(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, getPrHeader, rs, getPrItem, leng, stringValue, i, stringValueChiden;
  return regeneratorRuntime.async(function copyPr$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = ''; // var notification = socIo;

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0].toUpperCase();
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId.toUpperCase();
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(db.query("select \"PR_TYPE\",\"BUKRS\",\"DESCRIPTION\" FROM prm.\"PrTable\"\n        WHERE \"PR_NO\" = ".concat(req.body.params.PR_NO, ";")));

        case 5:
          getPrHeader = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"PrTable\"(\n            \"DESCRIPTION\", \"createBy\", \"changeBy\", \"STATUS\", \"StatusDescription\", \"PR_TYPE\", \"BUKRS\", \"createAt\", \"changeAt\")\n            VALUES ('".concat(getPrHeader.rows[0].DESCRIPTION, "', '").concat(userId, "', '").concat(userId, "', 1, 'Draft', '").concat(getPrHeader.rows[0].PR_TYPE, "', '").concat(getPrHeader.rows[0].BUKRS, "', 'now()', 'now()')\n            RETURNING \"PR_NO\";")));

        case 8:
          rs = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(db.query("select * FROM prm.\"PrItem\"\n        WHERE \"PR_NO\" = ".concat(req.body.params.PR_NO, ";")));

        case 11:
          getPrItem = _context.sent;
          leng = getPrItem.rows.length;

          if (!(leng > 0)) {
            _context.next = 18;
            break;
          }

          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_ITEM\",\"PR_NO\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n            \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n            \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES"; // const leng = dataItem.length

          for (i in getPrItem.rows) {
            // getPrItem.rows[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(getPrItem.rows[i].PR_ITEM, "','").concat(rs.rows[0].PR_NO, "','").concat(getPrItem.rows[i].KNTTP, "','").concat(getPrItem.rows[i].PSTYP, "','").concat(getPrItem.rows[i].MATNR, "','").concat(getPrItem.rows[i].MATKL, "','").concat(getPrItem.rows[i].TXZ01, "'\n                    ,'").concat(getPrItem.rows[i].WERKS, "','").concat(getPrItem.rows[i].LGORT, "','").concat(getPrItem.rows[i].LFDAT, "','").concat(getPrItem.rows[i].LIFNR, "','").concat(getPrItem.rows[i].MENGE, "','").concat(getPrItem.rows[i].MEINS, "','").concat(getPrItem.rows[i].PREIS, "'\n                    ,'").concat(getPrItem.rows[i].WEARS, "','").concat(getPrItem.rows[i].PEINH, "','").concat(getPrItem.rows[i].GSWRT, "','").concat(getPrItem.rows[i].LOCAL_AMOUNT, "','").concat(getPrItem.rows[i].EBELN, "','").concat(getPrItem.rows[i].EBELP, "','").concat(getPrItem.rows[i].LOEKZ, "'\n                    ,'").concat(getPrItem.rows[i].EKORG, "','").concat(getPrItem.rows[i].EKGRP, "','").concat(getPrItem.rows[i].WEPOS, "','").concat(getPrItem.rows[i].WEUNB, "','").concat(getPrItem.rows[i].BLCKD, "','").concat(getPrItem.rows[i].REPOS, "','").concat(getPrItem.rows[i].BLCKT, "'\n                    ,'").concat(getPrItem.rows[i].SAKTO, "','").concat(getPrItem.rows[i].KOSTL, "','").concat(getPrItem.rows[i].PRCTR, "','").concat(getPrItem.rows[i].ANLN1, "','").concat(getPrItem.rows[i].ANLN2, "','").concat(getPrItem.rows[i].AUFNR, "','").concat(getPrItem.rows[i].GSBER, "'\n                    ,'").concat(getPrItem.rows[i].KOKRS, "','").concat(getPrItem.rows[i].GEBER, "','").concat(getPrItem.rows[i].FIPOS, "','").concat(getPrItem.rows[i].FKBER, "','").concat(getPrItem.rows[i].FISTL, "','").concat(getPrItem.rows[i].INFNR, "')");

            if (leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          } //rs.rows[0].PR_NO


          _context.next = 18;
          return regeneratorRuntime.awrap(db.query(stringValue));

        case 18:
          return _context.abrupt("return", res.status(200).json({
            message: 'success'
          }));

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0
          }));

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

module.exports = {
  copyPr: copyPr
};