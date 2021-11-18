"use strict";

require('dotenv').config();

var crypt = require("../../crypt/crypt");

var decodeJWT = require('jwt-decode'); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../db/db");

var axios = require('axios');

var apiSap = require("../../apiSap/apiSap");

var updateTable = require("./component/updateTablePrAndRelease");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var saveAndSubmit = function saveAndSubmit(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, dataItem, leng, bukrs, waers, hwaers, query, update, dataCallSap, index, cd, conDition, _index, ob, api, data, rs, stringValue, _leng, i, stringValueChiden, _leng2, _i, _dataItem, _leng3, _query, id, _index2, _conDition, _index3, _ob, _api, checkError, _index4, _leng4, _i2, _leng5, _i3;

  return regeneratorRuntime.async(function saveAndSubmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = '';

          try {
            token = req.headers.authorization.split(' ')[1];
            basicAuth = Buffer.from(token, 'base64').toString('ascii');
            userId = basicAuth.split(':')[0];
          } catch (error) {
            accessToken = crypt.decrypt(req.headers.authorization);
            decodeTk = decodeJWT(accessToken);
            userId = decodeTk.userId;
          }

          if (!(req.body.params.dataPR.HEADER.PR_NO !== '' && req.body.params.dataPR.HEADER.PR_NO !== 0)) {
            _context.next = 64;
            break;
          }

          //update table Header 
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

          query = "UPDATE prm.\"PrTable\"\n            SET\n            \"DESCRIPTION\" = '".concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n            \"BUKRS\" = '").concat(bukrs, "',\n            \"PR_TYPE\" = '").concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n            \"WAERS\" = '").concat(waers, "',\n            \"HWAERS\" = '").concat(hwaers, "',\n            \"changeAt\"=now(),\n            \"changeBy\"='").concat(userId, "'\n            WHERE \"PR_NO\"=").concat(req.body.params.dataPR.HEADER.PR_NO, ";");
          _context.next = 17;
          return regeneratorRuntime.awrap(db.query(query));

        case 17:
          update = _context.sent;

          if (!(update.rowCount > 0)) {
            _context.next = 61;
            break;
          }

          _context.next = 21;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 21:
          //call api sap
          dataCallSap = req.body.params.dataPR;

          for (index in dataCallSap.ITEM) {
            dataCallSap.ITEM[index].PR_NO = req.body.params.dataPR.HEADER.PR_NO;
          } //get condition


          cd = [];
          _context.next = 26;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 26:
          conDition = _context.sent;

          for (_index in conDition.rows) {
            ob = {};
            ob.FIELD_NAME = conDition.rows[_index].columnName;
            cd.push(ob);
          }

          dataCallSap.COND_RELEASE = cd;
          _context.next = 31;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\""));

        case 31:
          api = _context.sent;

          if (!(api.rows.length > 0)) {
            _context.next = 58;
            break;
          }

          _context.next = 35;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST'));

        case 35:
          data = _context.sent;

          if (!(data.data.length > 0)) {
            _context.next = 50;
            break;
          }

          if (!(data.data[0].HEADER.TYPE === 'S')) {
            _context.next = 48;
            break;
          }

          _context.next = 40;
          return regeneratorRuntime.awrap(updateTable.updateTablePrAndRelease(data.data[0], req, dataCallSap, userId));

        case 40:
          rs = _context.sent;

          if (!rs) {
            _context.next = 48;
            break;
          }

          // dataItem = rs.ITEM[0];
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                            \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                            \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng = dataItem.length;

          for (i in dataItem) {
            // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(rs.ITEM[i].PR_NO, "','").concat(rs.ITEM[i].PR_ITEM, "','").concat(rs.ITEM[i].KNTTP, "','").concat(rs.ITEM[i].PSTYP, "','").concat(rs.ITEM[i].MATNR, "','").concat(rs.ITEM[i].MATKL, "','").concat(rs.ITEM[i].TXZ01, "'\n                                    ,'").concat(rs.ITEM[i].WERKS, "','").concat(rs.ITEM[i].LGORT, "','").concat(rs.ITEM[i].LFDAT, "','").concat(rs.ITEM[i].LIFNR, "','").concat(rs.ITEM[i].MENGE, "','").concat(rs.ITEM[i].MEINS, "','").concat(rs.ITEM[i].PREIS, "'\n                                    ,'").concat(rs.ITEM[i].WEARS, "','").concat(rs.ITEM[i].PEINH, "','").concat(rs.ITEM[i].GSWRT, "','").concat(rs.ITEM[i].LOCAL_AMOUNT, "','").concat(rs.ITEM[i].EBELN, "','").concat(rs.ITEM[i].EBELP, "','").concat(rs.ITEM[i].LOEKZ, "'\n                                    ,'").concat(rs.ITEM[i].EKORG, "','").concat(rs.ITEM[i].EKGRP, "','").concat(rs.ITEM[i].WEPOS, "','").concat(rs.ITEM[i].WEUNB, "','").concat(rs.ITEM[i].BLCKD, "','").concat(rs.ITEM[i].REPOS, "','").concat(rs.ITEM[i].BLCKT, "'\n                                    ,'").concat(rs.ITEM[i].SAKTO, "','").concat(rs.ITEM[i].KOSTL, "','").concat(rs.ITEM[i].PRCTR, "','").concat(rs.ITEM[i].ANLN1, "','").concat(rs.ITEM[i].ANLN2, "','").concat(rs.ITEM[i].AUFNR, "','").concat(rs.ITEM[i].GSBER, "'\n                                    ,'").concat(rs.ITEM[i].KOKRS, "','").concat(rs.ITEM[i].GEBER, "','").concat(rs.ITEM[i].FIPOS, "','").concat(rs.ITEM[i].FKBER, "','").concat(rs.ITEM[i].FISTL, "','").concat(rs.ITEM[i].INFNR, "')");

            if (_leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 47;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 47:
          return _context.abrupt("return", res.status(200).json(data.data));

        case 48:
          _context.next = 56;
          break;

        case 50:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                    \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                    \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng2 = dataItem.length;

          for (_i in dataItem) {
            dataItem[_i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i].PR_NO, "','").concat(dataItem[_i].PR_ITEM, "','").concat(dataItem[_i].KNTTP, "','").concat(dataItem[_i].PSTYP, "','").concat(dataItem[_i].MATNR, "','").concat(dataItem[_i].MATKL, "','").concat(dataItem[_i].TXZ01, "'\n                            ,'").concat(dataItem[_i].WERKS, "','").concat(dataItem[_i].LGORT, "','").concat(dataItem[_i].LFDAT, "','").concat(dataItem[_i].LIFNR, "','").concat(dataItem[_i].MENGE, "','").concat(dataItem[_i].MEINS, "','").concat(dataItem[_i].PREIS, "'\n                            ,'").concat(dataItem[_i].WEARS, "','").concat(dataItem[_i].PEINH, "','").concat(dataItem[_i].GSWRT, "','").concat(dataItem[_i].LOCAL_AMOUNT, "','").concat(dataItem[_i].EBELN, "','").concat(dataItem[_i].EBELP, "','").concat(dataItem[_i].LOEKZ, "'\n                            ,'").concat(dataItem[_i].EKORG, "','").concat(dataItem[_i].EKGRP, "','").concat(dataItem[_i].WEPOS, "','").concat(dataItem[_i].WEUNB, "','").concat(dataItem[_i].BLCKD, "','").concat(dataItem[_i].REPOS, "','").concat(dataItem[_i].BLCKT, "'\n                            ,'").concat(dataItem[_i].SAKTO, "','").concat(dataItem[_i].KOSTL, "','").concat(dataItem[_i].PRCTR, "','").concat(dataItem[_i].ANLN1, "','").concat(dataItem[_i].ANLN2, "','").concat(dataItem[_i].AUFNR, "','").concat(dataItem[_i].GSBER, "'\n                            ,'").concat(dataItem[_i].KOKRS, "','").concat(dataItem[_i].GEBER, "','").concat(dataItem[_i].FIPOS, "','").concat(dataItem[_i].FKBER, "','").concat(dataItem[_i].FISTL, "','").concat(dataItem[_i].INFNR, "')");

            if (_leng2 > Number(_i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 55;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 55:
          return _context.abrupt("return", res.status(200).json({
            message: 'Tạo thất bại!'
          }));

        case 56:
          _context.next = 59;
          break;

        case 58:
          return _context.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy đường dẫn!'
          }));

        case 59:
          _context.next = 62;
          break;

        case 61:
          return _context.abrupt("return", res.status(404).json({
            message: 'Cập nhật thất bại!,Kiểm tra số PR'
          }));

        case 62:
          _context.next = 117;
          break;

        case 64:
          //insert
          _dataItem = req.body.params.dataPR.ITEM;
          _leng3 = _dataItem.length;

          if (!(_leng3 === 0)) {
            _context.next = 68;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 68:
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

          _query = "INSERT INTO prm.\"PrTable\" (\"PR_TYPE\",\"BUKRS\", \"WAERS\",\"HWAERS\",\"DESCRIPTION\",\"createBy\",\"changeBy\")\n            VALUES ('".concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n                '").concat(bukrs, "',\n                '").concat(waers, "',\n                '").concat(hwaers, "',\n                '").concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n                '").concat(userId, "','").concat(userId, "')\n                RETURNING \"PR_NO\";");
          _context.next = 77;
          return regeneratorRuntime.awrap(db.query(_query));

        case 77:
          id = _context.sent;
          // var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
          //     "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
          //     "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL") VALUES`;
          // // const leng = dataItem.length
          // for (let i in dataItem) {
          //     dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
          //     var stringValueChiden = '';
          //     stringValueChiden = `('${id.rows[0].PR_NO}',${dataItem[i].PR_ITEM},'${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
          //             ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
          //             ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
          //             ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
          //             ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
          //             ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}')`;
          //     if (leng > Number(i) + 1) {
          //         stringValueChiden += ','
          //     }
          //     stringValue += stringValueChiden;
          // }
          // await db.query(`${stringValue};`);
          //call api sap
          dataCallSap = req.body.params.dataPR;

          for (_index2 in dataCallSap.ITEM) {
            dataCallSap.ITEM[_index2].PR_NO = id.rows[0].PR_NO;
          } //get condition


          cd = [];
          _context.next = 83;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 83:
          _conDition = _context.sent;

          for (_index3 in _conDition.rows) {
            _ob = {};
            _ob.FIELD_NAME = _conDition.rows[_index3].columnName;
            cd.push(_ob);
          }

          dataCallSap.COND_RELEASE = cd;
          dataCallSap.HEADER.PR_NO = id.rows[0].PR_NO;
          _context.next = 89;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\""));

        case 89:
          _api = _context.sent;

          if (!(_api.rows.length > 0)) {
            _context.next = 117;
            break;
          }

          _context.next = 93;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST'));

        case 93:
          data = _context.sent;

          if (!(data.data.length > 0)) {
            _context.next = 111;
            break;
          }

          checkError = false;

          for (_index4 in data.data) {
            if (data.data[_index4].HEADER.TYPE === 'E') {
              checkError = true;
            }
          }

          if (checkError) {
            _context.next = 108;
            break;
          }

          _context.next = 100;
          return regeneratorRuntime.awrap(updateTable.updateTablePrAndRelease(data.data[0], req, dataCallSap, userId));

        case 100:
          rs = _context.sent;

          if (!rs) {
            _context.next = 108;
            break;
          }

          // dataItem = rs.ITEM[0];
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                        \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                        \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng4 = _dataItem.length;

          for (_i2 in _dataItem) {
            // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(rs.ITEM[_i2].PR_NO, "','").concat(rs.ITEM[_i2].PR_ITEM, "','").concat(rs.ITEM[_i2].KNTTP, "','").concat(rs.ITEM[_i2].PSTYP, "','").concat(rs.ITEM[_i2].MATNR, "','").concat(rs.ITEM[_i2].MATKL, "','").concat(rs.ITEM[_i2].TXZ01, "'\n                                ,'").concat(rs.ITEM[_i2].WERKS, "','").concat(rs.ITEM[_i2].LGORT, "','").concat(rs.ITEM[_i2].LFDAT, "','").concat(rs.ITEM[_i2].LIFNR, "','").concat(rs.ITEM[_i2].MENGE, "','").concat(rs.ITEM[_i2].MEINS, "','").concat(rs.ITEM[_i2].PREIS, "'\n                                ,'").concat(rs.ITEM[_i2].WEARS, "','").concat(rs.ITEM[_i2].PEINH, "','").concat(rs.ITEM[_i2].GSWRT, "','").concat(rs.ITEM[_i2].LOCAL_AMOUNT, "','").concat(rs.ITEM[_i2].EBELN, "','").concat(rs.ITEM[_i2].EBELP, "','").concat(rs.ITEM[_i2].LOEKZ, "'\n                                ,'").concat(rs.ITEM[_i2].EKORG, "','").concat(rs.ITEM[_i2].EKGRP, "','").concat(rs.ITEM[_i2].WEPOS, "','").concat(rs.ITEM[_i2].WEUNB, "','").concat(rs.ITEM[_i2].BLCKD, "','").concat(rs.ITEM[_i2].REPOS, "','").concat(rs.ITEM[_i2].BLCKT, "'\n                                ,'").concat(rs.ITEM[_i2].SAKTO, "','").concat(rs.ITEM[_i2].KOSTL, "','").concat(rs.ITEM[_i2].PRCTR, "','").concat(rs.ITEM[_i2].ANLN1, "','").concat(rs.ITEM[_i2].ANLN2, "','").concat(rs.ITEM[_i2].AUFNR, "','").concat(rs.ITEM[_i2].GSBER, "'\n                                ,'").concat(rs.ITEM[_i2].KOKRS, "','").concat(rs.ITEM[_i2].GEBER, "','").concat(rs.ITEM[_i2].FIPOS, "','").concat(rs.ITEM[_i2].FKBER, "','").concat(rs.ITEM[_i2].FISTL, "','").concat(rs.ITEM[_i2].INFNR, "')");

            if (_leng4 > Number(_i2) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 107;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 107:
          return _context.abrupt("return", res.status(200).json(data.data));

        case 108:
          return _context.abrupt("return", res.status(200).json(data.data));

        case 111:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng5 = _dataItem.length;

          for (_i3 in _dataItem) {
            _dataItem[_i3]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(_dataItem[_i3].PR_NO, "','").concat(_dataItem[_i3].PR_ITEM, "','").concat(_dataItem[_i3].KNTTP, "','").concat(_dataItem[_i3].PSTYP, "','").concat(_dataItem[_i3].MATNR, "','").concat(_dataItem[_i3].MATKL, "','").concat(_dataItem[_i3].TXZ01, "'\n                        ,'").concat(_dataItem[_i3].WERKS, "','").concat(_dataItem[_i3].LGORT, "','").concat(_dataItem[_i3].LFDAT, "','").concat(_dataItem[_i3].LIFNR, "','").concat(_dataItem[_i3].MENGE, "','").concat(_dataItem[_i3].MEINS, "','").concat(_dataItem[_i3].PREIS, "'\n                        ,'").concat(_dataItem[_i3].WEARS, "','").concat(_dataItem[_i3].PEINH, "','").concat(_dataItem[_i3].GSWRT, "','").concat(_dataItem[_i3].LOCAL_AMOUNT, "','").concat(_dataItem[_i3].EBELN, "','").concat(_dataItem[_i3].EBELP, "','").concat(_dataItem[_i3].LOEKZ, "'\n                        ,'").concat(_dataItem[_i3].EKORG, "','").concat(_dataItem[_i3].EKGRP, "','").concat(_dataItem[_i3].WEPOS, "','").concat(_dataItem[_i3].WEUNB, "','").concat(_dataItem[_i3].BLCKD, "','").concat(_dataItem[_i3].REPOS, "','").concat(_dataItem[_i3].BLCKT, "'\n                        ,'").concat(_dataItem[_i3].SAKTO, "','").concat(_dataItem[_i3].KOSTL, "','").concat(_dataItem[_i3].PRCTR, "','").concat(_dataItem[_i3].ANLN1, "','").concat(_dataItem[_i3].ANLN2, "','").concat(_dataItem[_i3].AUFNR, "','").concat(_dataItem[_i3].GSBER, "'\n                        ,'").concat(_dataItem[_i3].KOKRS, "','").concat(_dataItem[_i3].GEBER, "','").concat(_dataItem[_i3].FIPOS, "','").concat(_dataItem[_i3].FKBER, "','").concat(_dataItem[_i3].FISTL, "','").concat(_dataItem[_i3].INFNR, "')");

            if (_leng5 > Number(_i3) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 116;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 116:
          return _context.abrupt("return", res.status(200).json({
            message: 'Tạo thất bại!'
          }));

        case 117:
          _context.next = 122;
          break;

        case 119:
          _context.prev = 119;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 122:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 119]]);
};

module.exports = {
  saveAndSubmit: saveAndSubmit
};