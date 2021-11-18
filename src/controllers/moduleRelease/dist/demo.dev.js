"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
var crypt = require("../../crypt/crypt");

require('dotenv').config();

var decodeJWT = require('jwt-decode');

var sleep = require('sleep');

var db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */


var postReleaseConfigList = function postReleaseConfigList(req, res) {
  var getResults;
  return regeneratorRuntime.async(function postReleaseConfigList$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          getResults = function _ref() {
            var userId, token, basicAuth, accessToken, decodeTk, queryMany, valueCode, valueName, valueTime, valueUsers, dataRqTable, data, stringQR, i, check, j, index, dataRq, query, rsInsertTable, typeDB, queryCreate, checkDelete, checkColumn, queryUpdate;
            return regeneratorRuntime.async(function getResults$(_context) {
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

                    queryMany = "";
                    valueCode = [];
                    valueName = [];
                    valueTime = [];
                    valueUsers = [];
                    dataRqTable = null; //= req.body.params.dataPost || req.body;

                    _context.prev = 9;
                    dataRqTable = req.body.params.dataPost;
                    _context.next = 18;
                    break;

                  case 13:
                    _context.prev = 13;
                    _context.t0 = _context["catch"](9);
                    dataRqTable = req.body;

                    if (!(req.body.length > 1)) {
                      _context.next = 18;
                      break;
                    }

                    throw new Error('No insert many value!');

                  case 18:
                    _context.next = 20;
                    return regeneratorRuntime.awrap(db.query("select id, \"tableName\", \"columnName\" from  prm.\"ModuleReleaseConditionType\"\n            WHERE \"tableName\"='".concat(req.body.params.tableName, "';")));

                  case 20:
                    data = _context.sent;
                    _context.prev = 21;
                    stringQR = "DELETE FROM prm.\"ModuleReleaseConditionType\" WHERE \"id\" IN (";

                    if (!(data.rows.length > dataRqTable.length)) {
                      _context.next = 46;
                      break;
                    }

                    _context.t1 = regeneratorRuntime.keys(data.rows);

                  case 25:
                    if ((_context.t2 = _context.t1()).done) {
                      _context.next = 42;
                      break;
                    }

                    i = _context.t2.value;
                    check = false;
                    _context.t3 = regeneratorRuntime.keys(dataRqTable);

                  case 29:
                    if ((_context.t4 = _context.t3()).done) {
                      _context.next = 36;
                      break;
                    }

                    j = _context.t4.value;

                    if (!(data.rows[i].columnName === dataRqTable[j].columnName)) {
                      _context.next = 34;
                      break;
                    }

                    check = true; // checkDelete = true;

                    return _context.abrupt("break", 36);

                  case 34:
                    _context.next = 29;
                    break;

                  case 36:
                    if (check) {
                      _context.next = 40;
                      break;
                    }

                    _context.next = 39;
                    return regeneratorRuntime.awrap(db.query("ALTER TABLE prm.\"".concat(data.rows[i].tableName, "\"\n                            DROP COLUMN IF EXISTS \"").concat(data.rows[i].columnName, "\",\n                            DROP COLUMN IF EXISTS \"").concat(data.rows[i].columnName + "_From", "\",\n                            DROP COLUMN IF EXISTS \"").concat(data.rows[i].columnName + "_To", "\";")));

                  case 39:
                    if (stringQR.length === 60) {
                      stringQR += "'".concat(data.rows[i].id, "'");
                    } else {
                      stringQR += ",'".concat(data.rows[i].id, "'");
                    }

                  case 40:
                    _context.next = 25;
                    break;

                  case 42:
                    stringQR += ');';

                    if (!(stringQR.length > 62)) {
                      _context.next = 46;
                      break;
                    }

                    _context.next = 46;
                    return regeneratorRuntime.awrap(db.query("".concat(stringQR)));

                  case 46:
                    _context.next = 50;
                    break;

                  case 48:
                    _context.prev = 48;
                    _context.t5 = _context["catch"](21);

                  case 50:
                    _context.t6 = regeneratorRuntime.keys(dataRqTable);

                  case 51:
                    if ((_context.t7 = _context.t6()).done) {
                      _context.next = 116;
                      break;
                    }

                    index = _context.t7.value;
                    dataRq = _objectSpread({}, dataRqTable[index]);
                    query = "SELECT to_regclass('prm.\"".concat(dataRq.tableName, "\"');");
                    _context.next = 57;
                    return regeneratorRuntime.awrap(db.query(query));

                  case 57:
                    rsInsertTable = _context.sent;
                    typeDB = '';

                    if (rsInsertTable.rows[0].to_regclass) {
                      _context.next = 82;
                      break;
                    }

                    if (!(dataRq.columnType === 'string' || dataRq.columnType === 'String' || dataRq.columnType === 'character varying')) {
                      _context.next = 74;
                      break;
                    }

                    _context.prev = 61;

                    if (!(Number(dataRq.length) > 0)) {
                      _context.next = 66;
                      break;
                    }

                    typeDB = "\"".concat(dataRq.columnName + "_From", "\" character varying(").concat(dataRq.length, "),\n                            \"").concat(dataRq.columnName + "_To", "\" character varying(").concat(dataRq.length, "),");
                    _context.next = 67;
                    break;

                  case 66:
                    throw new Error('Type (string) must specify the length');

                  case 67:
                    _context.next = 72;
                    break;

                  case 69:
                    _context.prev = 69;
                    _context.t8 = _context["catch"](61);
                    throw new Error(_context.t8);

                  case 72:
                    _context.next = 75;
                    break;

                  case 74:
                    if (dataRq.columnType === 'int' || dataRq.columnType === 'integer' || dataRq.columnType === 'Number') {
                      typeDB = "\"".concat(dataRq.columnName + "_From", "\" integer,\n                    \"").concat(dataRq.columnName + "_To", "\" integer,");
                    } else if (dataRq.columnType === 'boolean' || dataRq.columnType === 'Boolean') {
                      typeDB = "\"".concat(dataRq.columnName, "\" boolean,");
                    }

                  case 75:
                    queryCreate = "create table prm.\"".concat(dataRq.tableName, "\" ( \n                    ").concat(typeDB, "\n                \"Release_ID\" character varying(20),\n                \"Description\" text,\n                id SERIAL PRIMARY KEY,\n                \"createdAt\" timestamp default now(),\n                \"changeAt\" timestamp default now(),\n                \"createBy\" character varying(10),\n                \"changeBy\" character varying(10));");
                    _context.next = 78;
                    return regeneratorRuntime.awrap(db.query(queryCreate));

                  case 78:
                    _context.next = 80;
                    return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"ModuleReleaseConditionType\" (\"id\",\"tableName\", \"columnName\",\"Description\",\"columnType\",\"length\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\")  \n                select \n                unnest(array['".concat(dataRq.tableName).concat(dataRq.columnName, "']::character varying[]) as \"id\",\n                unnest(array['").concat(dataRq.tableName, "']::character varying[]) as \"tableName\",\n                unnest(array['").concat(dataRq.columnName, "']::character varying[]) as \"columnName\",\n                unnest(array['").concat(dataRq.Description, "']::text[]) as \"Description\",\n                unnest(array['").concat(dataRq.columnType, "']::character varying[]) as \"columnType\",\n                unnest(array['").concat(dataRq.length, "']::integer[]) as \"length\",\n                unnest(array['now()']::timestamp[]) as \"createdAt\",\n                unnest(array['now()']::timestamp[]) as \"changeAt\",\n                unnest(array['").concat(userId, "']::character varying[]) as \"createBy\",\n                unnest(array['").concat(userId, "']::character varying[]) as \"changeBy\"\n                ON CONFLICT (\"id\") DO UPDATE \n                  SET \n                    \"columnName\" = EXCLUDED.\"columnName\",\n                    \"Description\" = EXCLUDED.\"Description\",\n                    \"columnType\" = EXCLUDED.\"columnType\",\n                    \"length\" = EXCLUDED.\"length\",\n                    \"changeAt\"=EXCLUDED.\"changeAt\",\n                    \"changeBy\"=EXCLUDED.\"changeBy\";")));

                  case 80:
                    _context.next = 114;
                    break;

                  case 82:
                    //create column
                    //check column exits
                    checkDelete = false;
                    _context.next = 85;
                    return regeneratorRuntime.awrap(db.query("SELECT attname \n                FROM pg_attribute \n                WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = '".concat(dataRq.tableName, "') \n                AND attname = '").concat(dataRq.columnName, "' ;")));

                  case 85:
                    checkColumn = _context.sent;

                    if (checkColumn.rows.length !== 0 && dataRq.columnType !== 'boolean' && dataRq.columnType !== 'Boolean') {
                      //     await db.query(`ALTER TABLE prm."${dataRq.tableName}"
                      // DROP COLUMN IF EXISTS "${dataRq.columnName}",
                      // DROP COLUMN IF EXISTS "${dataRq.columnName + "_From"}",
                      // DROP COLUMN IF EXISTS "${dataRq.columnName + "_To"}";`);
                      checkDelete = true;
                    }

                    _context.next = 89;
                    return regeneratorRuntime.awrap(db.query("SELECT attname \n                FROM pg_attribute \n                WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = '".concat(dataRq.tableName, "') \n                AND ( attname = '").concat(dataRq.columnName + "_From", "' OR attname = '").concat(dataRq.columnName + "_To", "' ) ;")));

                  case 89:
                    checkColumn = _context.sent;

                    if (checkColumn.rows.length !== 0 && (dataRq.columnType === 'boolean' || dataRq.columnType === 'Boolean')) {
                      //     await db.query(`ALTER TABLE prm."${dataRq.tableName}"
                      // DROP COLUMN IF EXISTS "${dataRq.columnName}",
                      // DROP COLUMN IF EXISTS "${dataRq.columnName + "_From"}",
                      // DROP COLUMN IF EXISTS "${dataRq.columnName + "_To"}";`);
                      checkDelete = true;
                    }

                    if (!checkDelete) {
                      _context.next = 94;
                      break;
                    }

                    _context.next = 94;
                    return regeneratorRuntime.awrap(db.query("ALTER TABLE prm.\"".concat(dataRq.tableName, "\"\n                        DROP COLUMN IF EXISTS \"").concat(dataRq.columnName, "\",\n                        DROP COLUMN IF EXISTS \"").concat(dataRq.columnName + "_From", "\",\n                        DROP COLUMN IF EXISTS \"").concat(dataRq.columnName + "_To", "\";")));

                  case 94:
                    if (!(dataRq.columnType === 'string' || dataRq.columnType === 'String' || dataRq.columnType === 'character varying')) {
                      _context.next = 108;
                      break;
                    }

                    _context.prev = 95;

                    if (!(Number(dataRq.length) > 0)) {
                      _context.next = 100;
                      break;
                    }

                    typeDB = "ADD COLUMN \"".concat(dataRq.columnName + "_From", "\" character varying(").concat(dataRq.length, "),\n                            ADD COLUMN \"").concat(dataRq.columnName + "_To", "\" character varying(").concat(dataRq.length, ")");
                    _context.next = 101;
                    break;

                  case 100:
                    throw new Error('Type (string) must specify the length');

                  case 101:
                    _context.next = 106;
                    break;

                  case 103:
                    _context.prev = 103;
                    _context.t9 = _context["catch"](95);
                    throw new Error(_context.t9);

                  case 106:
                    _context.next = 109;
                    break;

                  case 108:
                    if (dataRq.columnType === 'int' || dataRq.columnType === 'integer' || dataRq.columnType === 'Number') {
                      typeDB = "ADD COLUMN \"".concat(dataRq.columnName + "_From", "\" integer,\n                    ADD COLUMN \"").concat(dataRq.columnName + "_To", "\" integer");
                    } else if (dataRq.columnType === 'boolean' || dataRq.columnType === 'Boolean') {
                      typeDB = "ADD COLUMN \"".concat(dataRq.columnName, "\" boolean");
                    }

                  case 109:
                    queryUpdate = "ALTER TABLE prm.\"".concat(dataRq.tableName, "\" ").concat(typeDB, ";");
                    _context.next = 112;
                    return regeneratorRuntime.awrap(db.query(queryUpdate));

                  case 112:
                    _context.next = 114;
                    return regeneratorRuntime.awrap(db.query("INSERT INTO prm.\"ModuleReleaseConditionType\" (\"id\",\"tableName\", \"columnName\",\"Description\",\"columnType\",\"length\",\"createAt\",\"changeAt\",\"createBy\",\"changeBy\")  \n               select \n               unnest(array['".concat(dataRq.tableName).concat(dataRq.columnName, "']::character varying[]) as \"id\",\n               unnest(array['").concat(dataRq.tableName, "']::character varying[]) as \"tableName\",\n               unnest(array['").concat(dataRq.columnName, "']::character varying[]) as \"columnName\",\n               unnest(array['").concat(dataRq.Description, "']::text[]) as \"Description\",\n               unnest(array['").concat(dataRq.columnType, "']::character varying[]) as \"columnType\",\n               unnest(array['").concat(dataRq.columnType === 'string' || dataRq.columnType === 'String' || dataRq.columnType === 'character varying' ? Number(dataRq.length) : 0, "']::integer[]) as \"length\",\n               unnest(array['now()']::timestamp[]) as \"createdAt\",\n               unnest(array['now()']::timestamp[]) as \"changeAt\",\n               unnest(array['").concat(userId, "']::character varying[]) as \"createBy\",\n               unnest(array['").concat(userId, "']::character varying[]) as \"changeBy\"\n               ON CONFLICT (\"id\") DO UPDATE \n                 SET \n                   \"columnName\" = EXCLUDED.\"columnName\",\n                   \"Description\" = EXCLUDED.\"Description\",\n                   \"columnType\" = EXCLUDED.\"columnType\",\n                   \"length\" = EXCLUDED.\"length\",\n                   \"changeAt\"=EXCLUDED.\"changeAt\",\n                   \"changeBy\"=EXCLUDED.\"changeBy\";")));

                  case 114:
                    _context.next = 51;
                    break;

                  case 116:
                    return _context.abrupt("return", 200);

                  case 119:
                    _context.prev = 119;
                    _context.t10 = _context["catch"](0);
                    throw new Error(_context.t10);

                  case 122:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[0, 119], [9, 13], [21, 48], [61, 69], [95, 103]]);
          };

          ;
          getResults().then(function (results) {
            // process results here
            if (results === 200) {
              return res.status(200).json({
                message: 'Success',
                code: 200
              });
            } else {
              return res.status(401).json({
                message: results.message,
                code: 401
              });
            }
          })["catch"](function (err) {
            // process error here
            return res.status(401).json({
              message: err.message,
              code: 401
            }); // console.log(err);
          });

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  postReleaseConfigList: postReleaseConfigList
};