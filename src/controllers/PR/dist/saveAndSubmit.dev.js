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
  var dataItem, userId, token, basicAuth, accessToken, decodeTk, leng, bukrs, waers, hwaers, query, update, dataCallSap, index, cd, conDition, _index, ob, data, checkError, _index2, rs, stringValue, _leng, i, stringValueChiden, _leng2, _i, _leng3, _i2, _leng4, _i3, _leng5, _query, id, _index3, _conDition, _index4, _ob, _index5, _leng6, _i4, _leng7, _i5, _leng8, _i6, _leng9, _i7;

  return regeneratorRuntime.async(function saveAndSubmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dataItem = null;
          _context.prev = 1;
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
            _context.next = 92;
            break;
          }

          //update table Header 
          dataItem = req.body.params.dataPR.ITEM;
          leng = dataItem.length;

          if (!(leng === 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 9:
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

          query = "UPDATE prm.\"PrTable\"\n            SET\n            \"DESCRIPTION\" = '".concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n            \"BUKRS\" = '").concat(bukrs, "',\n            \"PR_TYPE\" = '").concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n            \"WAERS\" = '").concat(waers, "',\n            \"HWAERS\" = '").concat(hwaers, "',\n            \"changeAt\"=now(),\n            \"changeBy\"='").concat(userId, "'\n            WHERE \"PR_NO\"=").concat(req.body.params.dataPR.HEADER.PR_NO, " RETURNING \"changeAt\";");
          _context.next = 18;
          return regeneratorRuntime.awrap(db.query(query));

        case 18:
          update = _context.sent;

          if (!(update.rowCount > 0)) {
            _context.next = 89;
            break;
          }

          // await db.query(`DELETE FROM prm."PrItem"
          // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
          //call api sap
          dataCallSap = req.body.params.dataPR;

          for (index in dataCallSap.ITEM) {
            dataCallSap.ITEM[index].PR_NO = req.body.params.dataPR.HEADER.PR_NO;
          } //get condition


          cd = [];
          _context.next = 25;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 25:
          conDition = _context.sent;

          for (_index in conDition.rows) {
            ob = {};
            ob.FIELD_NAME = conDition.rows[_index].columnName;
            cd.push(ob);
          }

          dataCallSap.COND_RELEASE = cd; // let api = await db.query(`select api from prm."API"`);
          // if (api.rows.length > 0) {

          _context.next = 30;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST'));

        case 30:
          data = _context.sent;

          if (!(data.response.status === 200)) {
            _context.next = 86;
            break;
          }

          if (!(data.data.length > 0)) {
            _context.next = 78;
            break;
          }

          checkError = false;
          _context.t0 = regeneratorRuntime.keys(data.data);

        case 35:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 42;
            break;
          }

          _index2 = _context.t1.value;

          if (!(data.data[_index2].HEADER.TYPE === 'E')) {
            _context.next = 40;
            break;
          }

          checkError = true;
          return _context.abrupt("break", 42);

        case 40:
          _context.next = 35;
          break;

        case 42:
          if (checkError) {
            _context.next = 67;
            break;
          }

          _context.next = 45;
          return regeneratorRuntime.awrap(updateTable.updateTablePrAndRelease(data.data[0], req, dataCallSap, userId));

        case 45:
          rs = _context.sent;

          if (!(rs.code && rs.code === 200)) {
            _context.next = 57;
            break;
          }

          _context.next = 49;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                                WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 49:
          // dataItem = rs.ITEM[0];
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                            \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                            \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng = dataItem.length;

          for (i in dataItem) {
            // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[i].PR_NO, "','").concat(dataItem[i].PR_ITEM, "','").concat(dataItem[i].KNTTP, "','").concat(dataItem[i].PSTYP, "','").concat(dataItem[i].MATNR, "','").concat(dataItem[i].MATKL, "','").concat(dataItem[i].TXZ01, "'\n                                    ,'").concat(dataItem[i].WERKS, "','").concat(dataItem[i].LGORT, "','").concat(dataItem[i].LFDAT, "','").concat(dataItem[i].LIFNR, "','").concat(dataItem[i].MENGE, "','").concat(dataItem[i].MEINS, "','").concat(dataItem[i].PREIS, "'\n                                    ,'").concat(dataItem[i].WEARS, "','").concat(dataItem[i].PEINH, "','").concat(dataItem[i].GSWRT, "','").concat(dataItem[i].LOCAL_AMOUNT, "','").concat(dataItem[i].EBELN, "','").concat(dataItem[i].EBELP, "','").concat(dataItem[i].LOEKZ, "'\n                                    ,'").concat(dataItem[i].EKORG, "','").concat(dataItem[i].EKGRP, "','").concat(dataItem[i].WEPOS, "','").concat(dataItem[i].WEUNB, "','").concat(dataItem[i].BLCKD, "','").concat(dataItem[i].REPOS, "','").concat(dataItem[i].BLCKT, "'\n                                    ,'").concat(dataItem[i].SAKTO, "','").concat(dataItem[i].KOSTL, "','").concat(dataItem[i].PRCTR, "','").concat(dataItem[i].ANLN1, "','").concat(dataItem[i].ANLN2, "','").concat(dataItem[i].AUFNR, "','").concat(dataItem[i].GSBER, "'\n                                    ,'").concat(dataItem[i].KOKRS, "','").concat(dataItem[i].GEBER, "','").concat(dataItem[i].FIPOS, "','").concat(dataItem[i].FKBER, "','").concat(dataItem[i].FISTL, "','").concat(dataItem[i].INFNR, "')");

            if (_leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 54;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 54:
          return _context.abrupt("return", res.status(200).json({
            data: data.data[0]
          }));

        case 57:
          _context.next = 59;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                                WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 59:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng2 = dataItem.length;

          for (_i in dataItem) {
            dataItem[_i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i].PR_NO, "','").concat(dataItem[_i].PR_ITEM, "','").concat(dataItem[_i].KNTTP, "','").concat(dataItem[_i].PSTYP, "','").concat(dataItem[_i].MATNR, "','").concat(dataItem[_i].MATKL, "','").concat(dataItem[_i].TXZ01, "'\n                                        ,'").concat(dataItem[_i].WERKS, "','").concat(dataItem[_i].LGORT, "','").concat(dataItem[_i].LFDAT, "','").concat(dataItem[_i].LIFNR, "','").concat(dataItem[_i].MENGE, "','").concat(dataItem[_i].MEINS, "','").concat(dataItem[_i].PREIS, "'\n                                        ,'").concat(dataItem[_i].WEARS, "','").concat(dataItem[_i].PEINH, "','").concat(dataItem[_i].GSWRT, "','").concat(dataItem[_i].LOCAL_AMOUNT, "','").concat(dataItem[_i].EBELN, "','").concat(dataItem[_i].EBELP, "','").concat(dataItem[_i].LOEKZ, "'\n                                        ,'").concat(dataItem[_i].EKORG, "','").concat(dataItem[_i].EKGRP, "','").concat(dataItem[_i].WEPOS, "','").concat(dataItem[_i].WEUNB, "','").concat(dataItem[_i].BLCKD, "','").concat(dataItem[_i].REPOS, "','").concat(dataItem[_i].BLCKT, "'\n                                        ,'").concat(dataItem[_i].SAKTO, "','").concat(dataItem[_i].KOSTL, "','").concat(dataItem[_i].PRCTR, "','").concat(dataItem[_i].ANLN1, "','").concat(dataItem[_i].ANLN2, "','").concat(dataItem[_i].AUFNR, "','").concat(dataItem[_i].GSBER, "'\n                                        ,'").concat(dataItem[_i].KOKRS, "','").concat(dataItem[_i].GEBER, "','").concat(dataItem[_i].FIPOS, "','").concat(dataItem[_i].FKBER, "','").concat(dataItem[_i].FISTL, "','").concat(dataItem[_i].INFNR, "')");

            if (_leng2 > Number(_i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 64;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 64:
          return _context.abrupt("return", res.status(201).json({
            data: rs.data,
            message: rs.message
          }));

        case 65:
          _context.next = 76;
          break;

        case 67:
          _context.next = 69;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                            WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 69:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                            \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                            \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng3 = dataItem.length;

          for (_i2 in dataItem) {
            dataItem[_i2]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i2].PR_NO, "','").concat(dataItem[_i2].PR_ITEM, "','").concat(dataItem[_i2].KNTTP, "','").concat(dataItem[_i2].PSTYP, "','").concat(dataItem[_i2].MATNR, "','").concat(dataItem[_i2].MATKL, "','").concat(dataItem[_i2].TXZ01, "'\n                                    ,'").concat(dataItem[_i2].WERKS, "','").concat(dataItem[_i2].LGORT, "','").concat(dataItem[_i2].LFDAT, "','").concat(dataItem[_i2].LIFNR, "','").concat(dataItem[_i2].MENGE, "','").concat(dataItem[_i2].MEINS, "','").concat(dataItem[_i2].PREIS, "'\n                                    ,'").concat(dataItem[_i2].WEARS, "','").concat(dataItem[_i2].PEINH, "','").concat(dataItem[_i2].GSWRT, "','").concat(dataItem[_i2].LOCAL_AMOUNT, "','").concat(dataItem[_i2].EBELN, "','").concat(dataItem[_i2].EBELP, "','").concat(dataItem[_i2].LOEKZ, "'\n                                    ,'").concat(dataItem[_i2].EKORG, "','").concat(dataItem[_i2].EKGRP, "','").concat(dataItem[_i2].WEPOS, "','").concat(dataItem[_i2].WEUNB, "','").concat(dataItem[_i2].BLCKD, "','").concat(dataItem[_i2].REPOS, "','").concat(dataItem[_i2].BLCKT, "'\n                                    ,'").concat(dataItem[_i2].SAKTO, "','").concat(dataItem[_i2].KOSTL, "','").concat(dataItem[_i2].PRCTR, "','").concat(dataItem[_i2].ANLN1, "','").concat(dataItem[_i2].ANLN2, "','").concat(dataItem[_i2].AUFNR, "','").concat(dataItem[_i2].GSBER, "'\n                                    ,'").concat(dataItem[_i2].KOKRS, "','").concat(dataItem[_i2].GEBER, "','").concat(dataItem[_i2].FIPOS, "','").concat(dataItem[_i2].FKBER, "','").concat(dataItem[_i2].FISTL, "','").concat(dataItem[_i2].INFNR, "')");

            if (_leng3 > Number(_i2) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 74;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 74:
          req.body.params.dataPR.HEADER.changeAt = update.rows[0].changeAt;
          return _context.abrupt("return", res.status(404).json({
            data: data.data,
            dataHeader: req.body.params.dataPR.HEADER
          }));

        case 76:
          _context.next = 84;
          break;

        case 78:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                    \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                    \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng4 = dataItem.length;

          for (_i3 in dataItem) {
            dataItem[_i3]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i3].PR_NO, "','").concat(dataItem[_i3].PR_ITEM, "','").concat(dataItem[_i3].KNTTP, "','").concat(dataItem[_i3].PSTYP, "','").concat(dataItem[_i3].MATNR, "','").concat(dataItem[_i3].MATKL, "','").concat(dataItem[_i3].TXZ01, "'\n                            ,'").concat(dataItem[_i3].WERKS, "','").concat(dataItem[_i3].LGORT, "','").concat(dataItem[_i3].LFDAT, "','").concat(dataItem[_i3].LIFNR, "','").concat(dataItem[_i3].MENGE, "','").concat(dataItem[_i3].MEINS, "','").concat(dataItem[_i3].PREIS, "'\n                            ,'").concat(dataItem[_i3].WEARS, "','").concat(dataItem[_i3].PEINH, "','").concat(dataItem[_i3].GSWRT, "','").concat(dataItem[_i3].LOCAL_AMOUNT, "','").concat(dataItem[_i3].EBELN, "','").concat(dataItem[_i3].EBELP, "','").concat(dataItem[_i3].LOEKZ, "'\n                            ,'").concat(dataItem[_i3].EKORG, "','").concat(dataItem[_i3].EKGRP, "','").concat(dataItem[_i3].WEPOS, "','").concat(dataItem[_i3].WEUNB, "','").concat(dataItem[_i3].BLCKD, "','").concat(dataItem[_i3].REPOS, "','").concat(dataItem[_i3].BLCKT, "'\n                            ,'").concat(dataItem[_i3].SAKTO, "','").concat(dataItem[_i3].KOSTL, "','").concat(dataItem[_i3].PRCTR, "','").concat(dataItem[_i3].ANLN1, "','").concat(dataItem[_i3].ANLN2, "','").concat(dataItem[_i3].AUFNR, "','").concat(dataItem[_i3].GSBER, "'\n                            ,'").concat(dataItem[_i3].KOKRS, "','").concat(dataItem[_i3].GEBER, "','").concat(dataItem[_i3].FIPOS, "','").concat(dataItem[_i3].FKBER, "','").concat(dataItem[_i3].FISTL, "','").concat(dataItem[_i3].INFNR, "')");

            if (_leng4 > Number(_i3) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 83;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 83:
          return _context.abrupt("return", res.status(200).json({
            data: data.data,
            message: 'Tạo thất bại!'
          }));

        case 84:
          _context.next = 87;
          break;

        case 86:
          return _context.abrupt("return", res.status(404).json({
            data: data.data,
            message: "".concat(data.response.statusText)
          }));

        case 87:
          _context.next = 90;
          break;

        case 89:
          return _context.abrupt("return", res.status(404).json({
            data: data.data,
            message: 'Cập nhật thất bại!,Kiểm tra số PR'
          }));

        case 90:
          _context.next = 167;
          break;

        case 92:
          //insert
          dataItem = req.body.params.dataPR.ITEM;
          _leng5 = dataItem.length;

          if (!(_leng5 === 0)) {
            _context.next = 96;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 96:
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

          _query = "INSERT INTO prm.\"PrTable\" (\"PR_TYPE\",\"BUKRS\", \"WAERS\",\"HWAERS\",\"DESCRIPTION\",\"createBy\",\"changeBy\")\n            VALUES ('".concat(req.body.params.dataPR.HEADER.PR_TYPE, "',\n                '").concat(bukrs, "',\n                '").concat(waers, "',\n                '").concat(hwaers, "',\n                '").concat(req.body.params.dataPR.HEADER.DESCRIPTION, "',\n                '").concat(userId, "','").concat(userId, "')\n                RETURNING \"PR_NO\",\"changeAt\";");
          _context.next = 105;
          return regeneratorRuntime.awrap(db.query(_query));

        case 105:
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

          for (_index3 in dataCallSap.ITEM) {
            dataCallSap.ITEM[_index3].PR_NO = id.rows[0].PR_NO;
          } //get condition


          cd = [];
          _context.next = 111;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 111:
          _conDition = _context.sent;

          for (_index4 in _conDition.rows) {
            _ob = {};
            _ob.FIELD_NAME = _conDition.rows[_index4].columnName;
            cd.push(_ob);
          }

          dataCallSap.COND_RELEASE = cd;
          dataCallSap.HEADER.PR_NO = id.rows[0].PR_NO; // let api = await db.query(`select api from prm."API"`);
          // if (api.rows.length > 0) {

          _context.next = 117;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST'));

        case 117:
          data = _context.sent;

          if (!(data.data.length > 0)) {
            _context.next = 161;
            break;
          }

          checkError = false;
          _context.t2 = regeneratorRuntime.keys(data.data);

        case 121:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 128;
            break;
          }

          _index5 = _context.t3.value;

          if (!(data.data[_index5].HEADER.TYPE === 'E')) {
            _context.next = 126;
            break;
          }

          checkError = true;
          return _context.abrupt("break", 128);

        case 126:
          _context.next = 121;
          break;

        case 128:
          if (checkError) {
            _context.next = 153;
            break;
          }

          _context.next = 131;
          return regeneratorRuntime.awrap(updateTable.updateTablePrAndRelease(data.data[0], req, dataCallSap, userId));

        case 131:
          rs = _context.sent;

          if (!(rs.code === 200)) {
            _context.next = 143;
            break;
          }

          _context.next = 135;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                            WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 135:
          // dataItem = rs.ITEM[0];
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                        \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                        \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng6 = dataItem.length;

          for (_i4 in dataItem) {
            // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i4].PR_NO, "','").concat(dataItem[_i4].PR_ITEM, "','").concat(dataItem[_i4].KNTTP, "','").concat(dataItem[_i4].PSTYP, "','").concat(dataItem[_i4].MATNR, "','").concat(dataItem[_i4].MATKL, "','").concat(dataItem[_i4].TXZ01, "'\n                                ,'").concat(dataItem[_i4].WERKS, "','").concat(dataItem[_i4].LGORT, "','").concat(dataItem[_i4].LFDAT, "','").concat(dataItem[_i4].LIFNR, "','").concat(dataItem[_i4].MENGE, "','").concat(dataItem[_i4].MEINS, "','").concat(dataItem[_i4].PREIS, "'\n                                ,'").concat(dataItem[_i4].WEARS, "','").concat(dataItem[_i4].PEINH, "','").concat(dataItem[_i4].GSWRT, "','").concat(dataItem[_i4].LOCAL_AMOUNT, "','").concat(dataItem[_i4].EBELN, "','").concat(dataItem[_i4].EBELP, "','").concat(dataItem[_i4].LOEKZ, "'\n                                ,'").concat(dataItem[_i4].EKORG, "','").concat(dataItem[_i4].EKGRP, "','").concat(dataItem[_i4].WEPOS, "','").concat(dataItem[_i4].WEUNB, "','").concat(dataItem[_i4].BLCKD, "','").concat(dataItem[_i4].REPOS, "','").concat(dataItem[_i4].BLCKT, "'\n                                ,'").concat(dataItem[_i4].SAKTO, "','").concat(dataItem[_i4].KOSTL, "','").concat(dataItem[_i4].PRCTR, "','").concat(dataItem[_i4].ANLN1, "','").concat(dataItem[_i4].ANLN2, "','").concat(dataItem[_i4].AUFNR, "','").concat(dataItem[_i4].GSBER, "'\n                                ,'").concat(dataItem[_i4].KOKRS, "','").concat(dataItem[_i4].GEBER, "','").concat(dataItem[_i4].FIPOS, "','").concat(dataItem[_i4].FKBER, "','").concat(dataItem[_i4].FISTL, "','").concat(dataItem[_i4].INFNR, "')");

            if (_leng6 > Number(_i4) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 140;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 140:
          return _context.abrupt("return", res.status(200).json({
            data: data.data[0]
          }));

        case 143:
          _context.next = 145;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                            WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 145:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                            \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                            \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng7 = dataItem.length;

          for (_i5 in dataItem) {
            dataItem[_i5]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i5].PR_NO, "','").concat(dataItem[_i5].PR_ITEM, "','").concat(dataItem[_i5].KNTTP, "','").concat(dataItem[_i5].PSTYP, "','").concat(dataItem[_i5].MATNR, "','").concat(dataItem[_i5].MATKL, "','").concat(dataItem[_i5].TXZ01, "'\n                                    ,'").concat(dataItem[_i5].WERKS, "','").concat(dataItem[_i5].LGORT, "','").concat(dataItem[_i5].LFDAT, "','").concat(dataItem[_i5].LIFNR, "','").concat(dataItem[_i5].MENGE, "','").concat(dataItem[_i5].MEINS, "','").concat(dataItem[_i5].PREIS, "'\n                                    ,'").concat(dataItem[_i5].WEARS, "','").concat(dataItem[_i5].PEINH, "','").concat(dataItem[_i5].GSWRT, "','").concat(dataItem[_i5].LOCAL_AMOUNT, "','").concat(dataItem[_i5].EBELN, "','").concat(dataItem[_i5].EBELP, "','").concat(dataItem[_i5].LOEKZ, "'\n                                    ,'").concat(dataItem[_i5].EKORG, "','").concat(dataItem[_i5].EKGRP, "','").concat(dataItem[_i5].WEPOS, "','").concat(dataItem[_i5].WEUNB, "','").concat(dataItem[_i5].BLCKD, "','").concat(dataItem[_i5].REPOS, "','").concat(dataItem[_i5].BLCKT, "'\n                                    ,'").concat(dataItem[_i5].SAKTO, "','").concat(dataItem[_i5].KOSTL, "','").concat(dataItem[_i5].PRCTR, "','").concat(dataItem[_i5].ANLN1, "','").concat(dataItem[_i5].ANLN2, "','").concat(dataItem[_i5].AUFNR, "','").concat(dataItem[_i5].GSBER, "'\n                                    ,'").concat(dataItem[_i5].KOKRS, "','").concat(dataItem[_i5].GEBER, "','").concat(dataItem[_i5].FIPOS, "','").concat(dataItem[_i5].FKBER, "','").concat(dataItem[_i5].FISTL, "','").concat(dataItem[_i5].INFNR, "')");

            if (_leng7 > Number(_i5) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 150;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 150:
          return _context.abrupt("return", res.status(201).json({
            data: rs.data,
            message: rs.message
          }));

        case 151:
          _context.next = 159;
          break;

        case 153:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                        \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                        \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng8 = dataItem.length;

          for (_i6 in dataItem) {
            dataItem[_i6]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i6].PR_NO, "','").concat(dataItem[_i6].PR_ITEM, "','").concat(dataItem[_i6].KNTTP, "','").concat(dataItem[_i6].PSTYP, "','").concat(dataItem[_i6].MATNR, "','").concat(dataItem[_i6].MATKL, "','").concat(dataItem[_i6].TXZ01, "'\n                                ,'").concat(dataItem[_i6].WERKS, "','").concat(dataItem[_i6].LGORT, "','").concat(dataItem[_i6].LFDAT, "','").concat(dataItem[_i6].LIFNR, "','").concat(dataItem[_i6].MENGE, "','").concat(dataItem[_i6].MEINS, "','").concat(dataItem[_i6].PREIS, "'\n                                ,'").concat(dataItem[_i6].WEARS, "','").concat(dataItem[_i6].PEINH, "','").concat(dataItem[_i6].GSWRT, "','").concat(dataItem[_i6].LOCAL_AMOUNT, "','").concat(dataItem[_i6].EBELN, "','").concat(dataItem[_i6].EBELP, "','").concat(dataItem[_i6].LOEKZ, "'\n                                ,'").concat(dataItem[_i6].EKORG, "','").concat(dataItem[_i6].EKGRP, "','").concat(dataItem[_i6].WEPOS, "','").concat(dataItem[_i6].WEUNB, "','").concat(dataItem[_i6].BLCKD, "','").concat(dataItem[_i6].REPOS, "','").concat(dataItem[_i6].BLCKT, "'\n                                ,'").concat(dataItem[_i6].SAKTO, "','").concat(dataItem[_i6].KOSTL, "','").concat(dataItem[_i6].PRCTR, "','").concat(dataItem[_i6].ANLN1, "','").concat(dataItem[_i6].ANLN2, "','").concat(dataItem[_i6].AUFNR, "','").concat(dataItem[_i6].GSBER, "'\n                                ,'").concat(dataItem[_i6].KOKRS, "','").concat(dataItem[_i6].GEBER, "','").concat(dataItem[_i6].FIPOS, "','").concat(dataItem[_i6].FKBER, "','").concat(dataItem[_i6].FISTL, "','").concat(dataItem[_i6].INFNR, "')");

            if (_leng8 > Number(_i6) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 158;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 158:
          return _context.abrupt("return", res.status(404).json({
            data: data.data,
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

        case 159:
          _context.next = 167;
          break;

        case 161:
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\",\"INFNR\") VALUES";
          _leng9 = dataItem.length;

          for (_i7 in dataItem) {
            dataItem[_i7]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[_i7].PR_NO, "','").concat(dataItem[_i7].PR_ITEM, "','").concat(dataItem[_i7].KNTTP, "','").concat(dataItem[_i7].PSTYP, "','").concat(dataItem[_i7].MATNR, "','").concat(dataItem[_i7].MATKL, "','").concat(dataItem[_i7].TXZ01, "'\n                        ,'").concat(dataItem[_i7].WERKS, "','").concat(dataItem[_i7].LGORT, "','").concat(dataItem[_i7].LFDAT, "','").concat(dataItem[_i7].LIFNR, "','").concat(dataItem[_i7].MENGE, "','").concat(dataItem[_i7].MEINS, "','").concat(dataItem[_i7].PREIS, "'\n                        ,'").concat(dataItem[_i7].WEARS, "','").concat(dataItem[_i7].PEINH, "','").concat(dataItem[_i7].GSWRT, "','").concat(dataItem[_i7].LOCAL_AMOUNT, "','").concat(dataItem[_i7].EBELN, "','").concat(dataItem[_i7].EBELP, "','").concat(dataItem[_i7].LOEKZ, "'\n                        ,'").concat(dataItem[_i7].EKORG, "','").concat(dataItem[_i7].EKGRP, "','").concat(dataItem[_i7].WEPOS, "','").concat(dataItem[_i7].WEUNB, "','").concat(dataItem[_i7].BLCKD, "','").concat(dataItem[_i7].REPOS, "','").concat(dataItem[_i7].BLCKT, "'\n                        ,'").concat(dataItem[_i7].SAKTO, "','").concat(dataItem[_i7].KOSTL, "','").concat(dataItem[_i7].PRCTR, "','").concat(dataItem[_i7].ANLN1, "','").concat(dataItem[_i7].ANLN2, "','").concat(dataItem[_i7].AUFNR, "','").concat(dataItem[_i7].GSBER, "'\n                        ,'").concat(dataItem[_i7].KOKRS, "','").concat(dataItem[_i7].GEBER, "','").concat(dataItem[_i7].FIPOS, "','").concat(dataItem[_i7].FKBER, "','").concat(dataItem[_i7].FISTL, "','").concat(dataItem[_i7].INFNR, "')");

            if (_leng9 > Number(_i7) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 166;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 166:
          return _context.abrupt("return", res.status(200).json({
            data: data.data,
            message: 'Tạo thất bại!'
          }));

        case 167:
          _context.next = 172;
          break;

        case 169:
          _context.prev = 169;
          _context.t4 = _context["catch"](1);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t4.message
          }));

        case 172:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 169]]);
};

module.exports = {
  saveAndSubmit: saveAndSubmit
};