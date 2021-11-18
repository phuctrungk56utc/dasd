"use strict";

require('dotenv').config();

var crypt = require("../../../crypt/crypt");

var decodeJWT = require('jwt-decode'); // const jwt = require("jsonwebtoken");


var sleep = require('sleep');

var db = require("../../../db/db");

var axios = require('axios');

var apiSap = require("../../../apiSap/apiSap");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var saveAndSubmit = function saveAndSubmit(req, res) {
  var userId, token, basicAuth, accessToken, decodeTk, dataItem, leng, bukrs, waers, hwaers, query, update, stringValue, _leng, i, stringValueChiden, dataCallSap, index, cd, conDition, _index, ob, api, data, stringRelease, lengX, _index2, release_ID, rs, userRl, query_PR_RL_STRA, _index3, _dataItem, _leng2, _query, id, _i, _index4, _conDition, _index5, _ob, _api, checkError, _index6, _stringRelease, _index7, _index8;

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
            _context.next = 89;
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
            _context.next = 86;
            break;
          }

          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\") VALUES";
          _leng = dataItem.length;

          for (i in dataItem) {
            dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(dataItem[i].PR_NO, "',").concat(dataItem[i].PR_ITEM, ",'").concat(dataItem[i].KNTTP, "','").concat(dataItem[i].PSTYP, "','").concat(dataItem[i].MATNR, "','").concat(dataItem[i].MATKL, "','").concat(dataItem[i].TXZ01, "'\n                        ,'").concat(dataItem[i].WERKS, "','").concat(dataItem[i].LGORT, "','").concat(dataItem[i].LFDAT, "','").concat(dataItem[i].LIFNR, "','").concat(dataItem[i].MENGE, "','").concat(dataItem[i].MEINS, "','").concat(dataItem[i].PREIS, "'\n                        ,'").concat(dataItem[i].WEARS, "','").concat(dataItem[i].PEINH, "','").concat(dataItem[i].GSWRT, "','").concat(dataItem[i].LOCAL_AMOUNT, "','").concat(dataItem[i].EBELN, "','").concat(dataItem[i].EBELP, "','").concat(dataItem[i].LOEKZ, "'\n                        ,'").concat(dataItem[i].EKORG, "','").concat(dataItem[i].EKGRP, "','").concat(dataItem[i].WEPOS, "','").concat(dataItem[i].WEUNB, "','").concat(dataItem[i].BLCKD, "','").concat(dataItem[i].REPOS, "','").concat(dataItem[i].BLCKT, "'\n                        ,'").concat(dataItem[i].SAKTO, "','").concat(dataItem[i].KOSTL, "','").concat(dataItem[i].PRCTR, "','").concat(dataItem[i].ANLN1, "','").concat(dataItem[i].ANLN2, "','").concat(dataItem[i].AUFNR, "','").concat(dataItem[i].GSBER, "'\n                        ,'").concat(dataItem[i].KOKRS, "','").concat(dataItem[i].GEBER, "','").concat(dataItem[i].FIPOS, "','").concat(dataItem[i].FKBER, "','").concat(dataItem[i].FISTL, "')");

            if (_leng > Number(i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 24;
          return regeneratorRuntime.awrap(db.query("DELETE FROM prm.\"PrItem\"\n                WHERE \"PR_NO\" = ".concat(req.body.params.dataPR.HEADER.PR_NO, ";")));

        case 24:
          _context.next = 26;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 26:
          //call api sap
          dataCallSap = req.body.params.dataPR;

          for (index in dataCallSap.ITEM) {
            dataCallSap.ITEM[index].PR_NO = req.body.params.dataPR.HEADER.PR_NO;
          } //get condition


          cd = [];
          _context.next = 31;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 31:
          conDition = _context.sent;

          for (_index in conDition.rows) {
            ob = {};
            ob.FIELD_NAME = conDition.rows[_index].columnName;
            cd.push(ob);
          }

          dataCallSap.COND_RELEASE = cd;
          _context.next = 36;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\""));

        case 36:
          api = _context.sent;

          if (!(api.rows.length > 0)) {
            _context.next = 83;
            break;
          }

          _context.next = 40;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST'));

        case 40:
          data = _context.sent;

          if (!(data.data[0].HEADER.TYPE === 'S')) {
            _context.next = 80;
            break;
          }

          //update to table
          stringRelease = "select \"Release_ID\" from prm.\"PR\" WHERE ";
          lengX = data.data[0].COND_RELEASE.length;

          for (_index2 in data.data[0].COND_RELEASE) {
            // stringRelease += `"${data.data[0].COND_RELEASE[index].FIELD_NAME}_From" <= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}' AND
            // "${data.data[0].COND_RELEASE[index].FIELD_NAME}_To" >= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}'`
            stringValueChiden = '';
            stringValueChiden = "\"".concat(data.data[0].COND_RELEASE[_index2].FIELD_NAME, "_From\" <= ").concat(data.data[0].COND_RELEASE[_index2].FIELD_VALUE, " AND\n                            \"").concat(data.data[0].COND_RELEASE[_index2].FIELD_NAME, "_To\" >= ").concat(data.data[0].COND_RELEASE[_index2].FIELD_VALUE);

            if (lengX > Number(_index2) + 1) {
              stringValueChiden += 'AND';
            }

            stringRelease += stringValueChiden;
          }

          _context.next = 47;
          return regeneratorRuntime.awrap(db.query("".concat(stringRelease, ";")));

        case 47:
          release_ID = _context.sent;

          if (!(release_ID.rows.length === 0)) {
            _context.next = 61;
            break;
          }

          _context.next = 51;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                                                SET \"PR_SAP\"=".concat(data.data[0].HEADER.PR_SAP, ", \"DESCRIPTION\"='").concat(dataCallSap.HEADER.DESCRIPTION, "', \"changeBy\"='").concat(userId, "',\"STATUS\"=5, \n                                                \"StatusDescription\"='Complete', \"LOCAL_AMOUNT\"=").concat(data.data[0].HEADER.LOCAL_AMOUNT, ", \n                                                \"WAERS\"='").concat(data.data[0].HEADER.WAERS ? data.data[0].HEADER.WAERS : '', "', \"HWAERS\"='").concat(data.data[0].HEADER.HWAERS ? data.data[0].HEADER.HWAERS : '', "', \n                                                \"changeAt\"=now(), \"Release_ID\"=''\n                                                WHERE \"PR_NO\"=").concat(data.data[0].HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\";")));

        case 51:
          rs = _context.sent;
          data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          data.data[0].HEADER.createBy = rs.rows[0].createBy;
          data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
          data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
          return _context.abrupt("return", res.status(200).json(data.data));

        case 61:
          _context.next = 63;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                            SET \"PR_SAP\" = ".concat(data.data[0].HEADER.PR_SAP, ",\"STATUS\"=2,\"LOCAL_AMOUNT\" = ").concat(data.data[0].HEADER.LOCAL_AMOUNT, ",\n                            \"Release_ID\"='").concat(release_ID.rows[0].Release_ID, "',\n                            \"HWAERS\"='").concat(data.data[0].HEADER.HWAERS, "'\n                            WHERE \"PR_NO\"=").concat(data.data[0].HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\"")));

        case 63:
          rs = _context.sent;
          data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          data.data[0].HEADER.createBy = rs.rows[0].createBy;
          data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
          data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
          data.data[0].HEADER.PR_TYPE = rs.rows[0].STATUS;
          _context.next = 73;
          return regeneratorRuntime.awrap(db.query("select \"Release_Level\", \"userId\" from prm.\"Strategy\" WHERE \"Release_ID\" = '".concat(release_ID.rows[0].Release_ID, "'")));

        case 73:
          userRl = _context.sent;
          query_PR_RL_STRA = "INSERT INTO prm.\"PR_RELEASE_STRATEGY\" (\"PR_NO\",\"userId\",\"RELEASE_LEVEL\") VALUES";
          lengX = userRl.rows.length;

          for (_index3 in userRl.rows) {
            stringValueChiden = '';
            stringValueChiden = "(".concat(data.data[0].HEADER.PR_NO, ",'").concat(userRl.rows[_index3].userId, "','").concat(userRl.rows[_index3].Release_Level, "')");

            if (lengX > Number(_index3) + 1) {
              stringValueChiden += ',';
            }

            query_PR_RL_STRA += stringValueChiden;
          }

          _context.next = 79;
          return regeneratorRuntime.awrap(db.query("".concat(query_PR_RL_STRA, ";")));

        case 79:
          return _context.abrupt("return", res.status(200).json(data.data));

        case 80:
          return _context.abrupt("return", res.status(404).json({
            message: 'Cập nhật thất bại!'
          }));

        case 83:
          return _context.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy đường dẫn!'
          }));

        case 84:
          _context.next = 87;
          break;

        case 86:
          return _context.abrupt("return", res.status(404).json({
            message: 'Cập nhật thất bại!,Kiểm tra số PR'
          }));

        case 87:
          _context.next = 165;
          break;

        case 89:
          //insert
          _dataItem = req.body.params.dataPR.ITEM;
          _leng2 = _dataItem.length;

          if (!(_leng2 === 0)) {
            _context.next = 93;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Yêu cầu có item!'
          }));

        case 93:
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
          _context.next = 102;
          return regeneratorRuntime.awrap(db.query(_query));

        case 102:
          id = _context.sent;
          stringValue = "INSERT INTO prm.\"PrItem\" (\"PR_NO\",\"PR_ITEM\",\"KNTTP\",\"PSTYP\", \"MATNR\",\"MATKL\",\"TXZ01\",\"WERKS\",\"LGORT\",\"LFDAT\",\"LIFNR\",\n                \"MENGE\",\"MEINS\",\"PREIS\",\"WEARS\",\"PEINH\",\"GSWRT\",\"LOCAL_AMOUNT\",\"EBELN\",\"EBELP\",\"LOEKZ\",\"EKORG\",\"EKGRP\",\"WEPOS\",\"WEUNB\",\n                \"BLCKD\",\"REPOS\",\"BLCKT\",\"SAKTO\",\"KOSTL\",\"PRCTR\",\"ANLN1\",\"ANLN2\",\"AUFNR\",\"GSBER\",\"KOKRS\",\"GEBER\",\"FIPOS\",\"FKBER\",\"FISTL\") VALUES"; // const leng = dataItem.length

          for (_i in _dataItem) {
            _dataItem[_i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
            stringValueChiden = '';
            stringValueChiden = "('".concat(id.rows[0].PR_NO, "',").concat(_dataItem[_i].PR_ITEM, ",'").concat(_dataItem[_i].KNTTP, "','").concat(_dataItem[_i].PSTYP, "','").concat(_dataItem[_i].MATNR, "','").concat(_dataItem[_i].MATKL, "','").concat(_dataItem[_i].TXZ01, "'\n                        ,'").concat(_dataItem[_i].WERKS, "','").concat(_dataItem[_i].LGORT, "','").concat(_dataItem[_i].LFDAT, "','").concat(_dataItem[_i].LIFNR, "','").concat(_dataItem[_i].MENGE, "','").concat(_dataItem[_i].MEINS, "','").concat(_dataItem[_i].PREIS, "'\n                        ,'").concat(_dataItem[_i].WEARS, "','").concat(_dataItem[_i].PEINH, "','").concat(_dataItem[_i].GSWRT, "','").concat(_dataItem[_i].LOCAL_AMOUNT, "','").concat(_dataItem[_i].EBELN, "','").concat(_dataItem[_i].EBELP, "','").concat(_dataItem[_i].LOEKZ, "'\n                        ,'").concat(_dataItem[_i].EKORG, "','").concat(_dataItem[_i].EKGRP, "','").concat(_dataItem[_i].WEPOS, "','").concat(_dataItem[_i].WEUNB, "','").concat(_dataItem[_i].BLCKD, "','").concat(_dataItem[_i].REPOS, "','").concat(_dataItem[_i].BLCKT, "'\n                        ,'").concat(_dataItem[_i].SAKTO, "','").concat(_dataItem[_i].KOSTL, "','").concat(_dataItem[_i].PRCTR, "','").concat(_dataItem[_i].ANLN1, "','").concat(_dataItem[_i].ANLN2, "','").concat(_dataItem[_i].AUFNR, "','").concat(_dataItem[_i].GSBER, "'\n                        ,'").concat(_dataItem[_i].KOKRS, "','").concat(_dataItem[_i].GEBER, "','").concat(_dataItem[_i].FIPOS, "','").concat(_dataItem[_i].FKBER, "','").concat(_dataItem[_i].FISTL, "')");

            if (_leng2 > Number(_i) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          } // await db.query(`DELETE FROM prm."PrItem"
          // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);


          _context.next = 107;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue, ";")));

        case 107:
          //call api sap
          dataCallSap = req.body.params.dataPR;

          for (_index4 in dataCallSap.ITEM) {
            dataCallSap.ITEM[_index4].PR_NO = id.rows[0].PR_NO;
          } //get condition


          cd = [];
          _context.next = 112;
          return regeneratorRuntime.awrap(db.query("select \"columnName\" from prm.\"ModuleReleaseConditionType\" WHERE \"tableName\" = 'PR';"));

        case 112:
          _conDition = _context.sent;

          for (_index5 in _conDition.rows) {
            _ob = {};
            _ob.FIELD_NAME = _conDition.rows[_index5].columnName;
            cd.push(_ob);
          }

          dataCallSap.COND_RELEASE = cd;
          dataCallSap.HEADER.PR_NO = id.rows[0].PR_NO;
          _context.next = 118;
          return regeneratorRuntime.awrap(db.query("select api from prm.\"API\""));

        case 118:
          _api = _context.sent;

          if (!(_api.rows.length > 0)) {
            _context.next = 165;
            break;
          }

          _context.next = 122;
          return regeneratorRuntime.awrap(apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST'));

        case 122:
          data = _context.sent;
          checkError = false;

          for (_index6 in data.data) {
            if (data.data[_index6].HEADER.TYPE === 'E') {
              checkError = true;
            }
          }

          if (checkError) {
            _context.next = 164;
            break;
          }

          //check condition return release_ID
          _stringRelease = "select \"Release_ID\" from prm.\"PR\" WHERE ";
          lengX = data.data[0].COND_RELEASE.length;

          for (_index7 in data.data[0].COND_RELEASE) {
            // stringRelease += `"${data.data[0].COND_RELEASE[index].FIELD_NAME}_From" <= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}' AND
            // "${data.data[0].COND_RELEASE[index].FIELD_NAME}_To" >= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}'`
            stringValueChiden = '';
            stringValueChiden = "\"".concat(data.data[0].COND_RELEASE[_index7].FIELD_NAME, "_From\" <= ").concat(data.data[0].COND_RELEASE[_index7].FIELD_VALUE, " AND\n                        \"").concat(data.data[0].COND_RELEASE[_index7].FIELD_NAME, "_To\" >= ").concat(data.data[0].COND_RELEASE[_index7].FIELD_VALUE);

            if (lengX > Number(_index7) + 1) {
              stringValueChiden += 'AND';
            }

            _stringRelease += stringValueChiden;
          }

          _context.next = 131;
          return regeneratorRuntime.awrap(db.query("".concat(_stringRelease, ";")));

        case 131:
          release_ID = _context.sent;

          if (!(release_ID.rows.length === 0)) {
            _context.next = 145;
            break;
          }

          _context.next = 135;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                                                SET \"PR_SAP\"=".concat(data.data[0].HEADER.PR_SAP, ", \"DESCRIPTION\"='").concat(dataCallSap.HEADER.DESCRIPTION, "', \"changeBy\"='").concat(userId, "',\"STATUS\"=5, \n                                                \"StatusDescription\"='Complete', \"LOCAL_AMOUNT\"=").concat(data.data[0].HEADER.LOCAL_AMOUNT, ", \n                                                \"WAERS\"='").concat(data.data[0].HEADER.WAERS ? data.data[0].HEADER.WAERS : '', "', \"HWAERS\"='").concat(data.data[0].HEADER.HWAERS ? data.data[0].HEADER.HWAERS : '', "', \n                                                \"changeAt\"=now(), \"Release_ID\"=''\n                                                WHERE \"PR_NO\"=").concat(data.data[0].HEADER.PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\";")));

        case 135:
          rs = _context.sent;
          data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          data.data[0].HEADER.createBy = rs.rows[0].createBy;
          data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
          data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
          return _context.abrupt("return", res.status(200).json(data.data));

        case 145:
          _context.next = 147;
          return regeneratorRuntime.awrap(db.query("UPDATE prm.\"PrTable\"\n                        SET \"PR_SAP\" = ".concat(data.data[0].HEADER.PR_SAP, ",\"STATUS\"=2,\"LOCAL_AMOUNT\" = ").concat(data.data[0].HEADER.LOCAL_AMOUNT, ",\n                        \"Release_ID\"='").concat(release_ID.rows[0].Release_ID, "',\n                        \"HWAERS\"='").concat(data.data[0].HEADER.HWAERS, "'\n                        WHERE \"PR_NO\"=").concat(id.rows[0].PR_NO, " RETURNING \"createBy\", \"changeAt\", \"STATUS\",\"DESCRIPTION\"")));

        case 147:
          rs = _context.sent;
          data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
          data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
          data.data[0].HEADER.createBy = rs.rows[0].createBy;
          data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
          data.data[0].HEADER.STATUS = rs.rows[0].STATUS; // data.data[0].ITEM = 

          _context.next = 156;
          return regeneratorRuntime.awrap(db.query("select \"Release_Level\", \"userId\" from prm.\"Strategy\" WHERE \"Release_ID\" = '".concat(release_ID.rows[0].Release_ID, "'")));

        case 156:
          userRl = _context.sent;
          query_PR_RL_STRA = "INSERT INTO prm.\"PR_RELEASE_STRATEGY\" (\"PR_NO\",\"userId\",\"RELEASE_LEVEL\") VALUES";
          lengX = userRl.rows.length;

          for (_index8 in userRl.rows) {
            stringValueChiden = '';
            stringValueChiden = "(".concat(id.rows[0].PR_NO, ",'").concat(userRl.rows[_index8].userId, "','").concat(userRl.rows[_index8].Release_Level, "')");

            if (lengX > Number(_index8) + 1) {
              stringValueChiden += ',';
            }

            query_PR_RL_STRA += stringValueChiden;
          }

          _context.next = 162;
          return regeneratorRuntime.awrap(db.query("".concat(query_PR_RL_STRA, ";")));

        case 162:
          // console.log(userRl)
          data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
          return _context.abrupt("return", res.status(200).json(data.data));

        case 164:
          return _context.abrupt("return", res.status(200).json(data.data));

        case 165:
          _context.next = 170;
          break;

        case 167:
          _context.prev = 167;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(404).json({
            message: _context.t0.message
          }));

        case 170:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 167]]);
};

module.exports = {
  saveAndSubmit: saveAndSubmit
};