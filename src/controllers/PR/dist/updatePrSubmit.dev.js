"use strict";

require('dotenv').config();

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode'); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var apiSap = require("../../apiSap/apiSap");

var axios = require('axios');

var updateTable = require("./component/updateTablePrAndRelease");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var updatePrSubmit = function updatePrSubmit(req, res) {
  var checkStatus, userId, token, basicAuth, accessToken, decodeTk, dataItem, leng, dataCallSap, index, cd, conDition, _index, ob, bukrs, waers, hwaers, query, update, api, data, _index2, _conDition, _index3, _ob, _api, rs, stringValue, _leng, i, stringValueChiden, _leng2, _i;

  return regeneratorRuntime.async(function updatePrSubmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.query("select \"STATUS\" from prm.\"PrTable\" where \"PR_NO\"=".concat(req.body.params.dataPR.HEADER.PR_NO)));

        case 3:
          checkStatus = _context.sent;

          if (!(checkStatus.rows[0].STATUS === 2)) {
            _context.next = 86;
            break;
          }

          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0];
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
          } // if (req.body.params.dataPR.HEADER.PR_SAP !== '' && req.body.params.dataPR.HEADER.PR_SAP !== 0) {
          //update table Header 


          dataItem = req.body.params.dataPR.ITEM;
          leng = dataItem.length;

          if (!(leng === 0)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 11:
          dataCallSap = req.body.params.dataPR;
          dataCallSap.HEADER.PR_SAP = req.body.params.dataPR.HEADER.PR_SAP;

          for (index in dataCallSap.ITEM) {
            dataCallSap.ITEM[index].PR_NO = req.body.params.dataPR.HEADER.PR_NO;
          } //get condition


          cd = [];
          _context.next = 17;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 17:
          conDition = _context.sent;

          for (_index in conDition.rows) {
            ob = {};
            ob.FIELD_NAME = conDition.rows[_index].columnName;
            cd.push(ob);
          }

          dataCallSap.COND_RELEASE = cd; //update Header

          bukrs = '';

          if (req.body.params.dataPR.HEADER.BUKRS !== undefined) {
            bukrs = req.body.params.dataPR.HEADER.BUKRS;
          }

          waers = '';

          if (req.body.params.dataPR.HEADER.WAERS !== undefined) {
            waers = req.body.params.dataPR.HEADER.WAERS;
          }

          hwaers = '';

          if (req.body.params.dataPR.HEADER.HWAERS !== undefined) {
            hwaers = req.body.params.dataPR.HEADER.HWAERS;
          }

          query = "UPDATE prm.\"PrTable\"\n\t\tSET\n\t\t\"DESCRIPTION\" = '".concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n\t\t\"BUKRS\" = '").concat(bukrs, "',\n\t\t\"PR_TYPE\" = '").concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n\t\t\"WAERS\" = '").concat(waers, "',\n\t\t\"HWAERS\" = '").concat(hwaers, "',\n\t\t\"changeAt\"=now(),\n\t\t\"changeBy\"='").concat(userId, "'\n\t\tWHERE \"PR_NO\"=").concat(req.body.params.dataPR.HEADER.PR_NO, ";");
          _context.next = 29;
          return regeneratorRuntime.awrap(db.query(query));

        case 29:
          update = _context.sent;
          _context.next = 32;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\""));

        case 32:
          api = _context.sent;

          if (!(api.rows.length > 0)) {
            _context.next = 83;
            break;
          }

          _context.next = 36;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'PUT'));

        case 36:
          data = _context.sent;
          dataCallSap.ITEM = data.data.ITEM;

          if (!(data.data.HEADER.TYPE === 'S')) {
            _context.next = 80;
            break;
          }

          _context.next = 41;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n\t\t\t\t\tWHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 41:
          //call api sap
          dataCallSap = req.body.params.dataPR;

          for (_index2 in dataCallSap.ITEM) {
            dataCallSap.ITEM[_index2].PR_NO = req.body.params.dataPR.HEADER.PR_NO;
          } //get condition


          cd = [];
          _context.next = 46;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 46:
          _conDition = _context.sent;

          for (_index3 in _conDition.rows) {
            _ob = {};
            _ob.FIELD_NAME = _conDition.rows[_index3].columnName;
            cd.push(_ob);
          }

          dataCallSap.COND_RELEASE = cd;
          _context.next = 51;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\""));

        case 51:
          _api = _context.sent;

          if (!(_api.rows.length > 0)) {
            _context.next = 77;
            break;
          }

          _context.next = 55;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'PUT'));

        case 55:
          data = _context.sent;

          if (!(data.data.HEADER.TYPE === 'S')) {
            _context.next = 69;
            break;
          }

          _context.next = 59;
          return regeneratorRuntime.awrap(updateTable.updateTablePrAndRelease(data.data, req, dataCallSap, userId));

        case 59:
          rs = _context.sent;

          if (!rs) {
            _context.next = 67;
            break;
          }

          // dataItem = rs.ITEM[0];
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n\t\t\t\t\t\t\t\t\"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n\t\t\t\t\t\t\t\t\"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng = dataItem.length;

          for (i in data.data.ITEM) {
            // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(data.data.ITEM[i].PR_NO, "','").concat(data.data.ITEM[i].PR_ITEM, "','").concat(data.data.ITEM[i].KNTTP, "','").concat(data.data.ITEM[i].PSTYP, "','").concat(data.data.ITEM[i].MATNR, "','").concat(data.data.ITEM[i].MATKL, "','").concat(data.data.ITEM[i].TXZ01, "'\n\t\t\t\t\t\t\t\t\t\t,'").concat(data.data.ITEM[i].WERKS, "','").concat(data.data.ITEM[i].LGORT, "','").concat(data.data.ITEM[i].LFDAT, "','").concat(data.data.ITEM[i].LIFNR, "','").concat(data.data.ITEM[i].MENGE, "','").concat(data.data.ITEM[i].MEINS, "','").concat(data.data.ITEM[i].PREIS, "'\n\t\t\t\t\t\t\t\t\t\t,'").concat(data.data.ITEM[i].WEARS, "','").concat(data.data.ITEM[i].PEINH, "','").concat(data.data.ITEM[i].GSWRT, "','").concat(data.data.ITEM[i].LOCAL_AMOUNT, "','").concat(data.data.ITEM[i].EBELN, "','").concat(data.data.ITEM[i].EBELP, "','").concat(data.data.ITEM[i].LOEKZ, "'\n\t\t\t\t\t\t\t\t\t\t,'").concat(data.data.ITEM[i].EKORG, "','").concat(data.data.ITEM[i].EKGRP, "','").concat(data.data.ITEM[i].WEPOS, "','").concat(data.data.ITEM[i].WEUNB, "','").concat(data.data.ITEM[i].BLCKD, "','").concat(data.data.ITEM[i].REPOS, "','").concat(data.data.ITEM[i].BLCKT, "'\n\t\t\t\t\t\t\t\t\t\t,'").concat(data.data.ITEM[i].SAKTO, "','").concat(data.data.ITEM[i].KOSTL, "','").concat(data.data.ITEM[i].PRCTR, "','").concat(data.data.ITEM[i].ANLN1, "','").concat(data.data.ITEM[i].ANLN2, "','").concat(data.data.ITEM[i].AUFNR, "','").concat(data.data.ITEM[i].GSBER, "'\n\t\t\t\t\t\t\t\t\t\t,'").concat(data.data.ITEM[i].KOKRS, "','").concat(data.data.ITEM[i].GEBER, "','").concat(data.data.ITEM[i].FIPOS, "','").concat(data.data.ITEM[i].FKBER, "','").concat(data.data.ITEM[i].FISTL, "','").concat(data.data.ITEM[i].INFNR, "')");

            if (_leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 66;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 66:
          return _context.abrupt("return", res.status(200).json(rs));

        case 67:
          _context.next = 75;
          break;

        case 69:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n\t\t\t\t\t\t\"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n\t\t\t\t\t\t\"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng2 = dataItem.length;

          for (_i in dataItem) {
            dataItem[_i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i].PR_NO, "','").concat(dataItem[_i].PR_ITEM, "','").concat(dataItem[_i].KNTTP, "','").concat(dataItem[_i].PSTYP, "','").concat(dataItem[_i].MATNR, "','").concat(dataItem[_i].MATKL, "','").concat(dataItem[_i].TXZ01, "'\n\t\t\t\t\t\t\t\t,'").concat(dataItem[_i].WERKS, "','").concat(dataItem[_i].LGORT, "','").concat(dataItem[_i].LFDAT, "','").concat(dataItem[_i].LIFNR, "','").concat(dataItem[_i].MENGE, "','").concat(dataItem[_i].MEINS, "','").concat(dataItem[_i].PREIS, "'\n\t\t\t\t\t\t\t\t,'").concat(dataItem[_i].WEARS, "','").concat(dataItem[_i].PEINH, "','").concat(dataItem[_i].GSWRT, "','").concat(dataItem[_i].LOCAL_AMOUNT, "','").concat(dataItem[_i].EBELN, "','").concat(dataItem[_i].EBELP, "','").concat(dataItem[_i].LOEKZ, "'\n\t\t\t\t\t\t\t\t,'").concat(dataItem[_i].EKORG, "','").concat(dataItem[_i].EKGRP, "','").concat(dataItem[_i].WEPOS, "','").concat(dataItem[_i].WEUNB, "','").concat(dataItem[_i].BLCKD, "','").concat(dataItem[_i].REPOS, "','").concat(dataItem[_i].BLCKT, "'\n\t\t\t\t\t\t\t\t,'").concat(dataItem[_i].SAKTO, "','").concat(dataItem[_i].KOSTL, "','").concat(dataItem[_i].PRCTR, "','").concat(dataItem[_i].ANLN1, "','").concat(dataItem[_i].ANLN2, "','").concat(dataItem[_i].AUFNR, "','").concat(dataItem[_i].GSBER, "'\n\t\t\t\t\t\t\t\t,'").concat(dataItem[_i].KOKRS, "','").concat(dataItem[_i].GEBER, "','").concat(dataItem[_i].FIPOS, "','").concat(dataItem[_i].FKBER, "','").concat(dataItem[_i].FISTL, "','").concat(dataItem[_i].INFNR, "')");

            if (_leng2 > Number(_i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 74;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 74:
          return _context.abrupt("return", res.status(200).json({
            message: 'Tạo thất bại!'
          }));

        case 75:
          _context.next = 78;
          break;

        case 77:
          return _context.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy đường dẫn!'
          }));

        case 78:
          _context.next = 81;
          break;

        case 80:
          return _context.abrupt("return", res.status(404).json(data.data));

        case 81:
          _context.next = 84;
          break;

        case 83:
          return _context.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy đường dẫn!'
          }));

        case 84:
          _context.next = 87;
          break;

        case 86:
          return _context.abrupt("return", res.status(404).json({
            message: 'Trạng thái hiện tại không cho phép!'
          }));

        case 87:
          _context.next = 92;
          break;

        case 89:
          _context.prev = 89;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 92:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 89]]);
};

module.exports = {
  updatePrSubmit: updatePrSubmit
};