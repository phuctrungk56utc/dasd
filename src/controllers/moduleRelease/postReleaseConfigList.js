// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
const crypt = require("../../crypt/crypt");
require('dotenv').config()
const decodeJWT = require('jwt-decode');
var sleep = require('sleep');
const db = require("../../db/db");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let postReleaseConfigList = async (req, res) => {

    async function getResults() {
        try {
            var userId = '';
            try {
                const token = req.headers.authorization.split(' ')[1];
                const basicAuth = Buffer.from(token, 'base64').toString('ascii');
                userId = basicAuth.split(':')[0];
            } catch (error) {
                const accessToken = crypt.decrypt(req.headers.authorization);
                const decodeTk = decodeJWT(accessToken);
                userId = decodeTk.userId;
            }

            var queryMany = ``;
            var valueCode = [];
            var valueName = [];
            var valueTime = [];
            var valueUsers = [];
            var dataRqTable = null; //= req.body.params.dataPost || req.body;
            try {
                dataRqTable = req.body.params.dataPost;
            } catch (error) {
                dataRqTable = req.body;
                if (req.body.length > 1) {
                    throw new Error('No insert many value!');
                }
            }
            var data = await db.query(`select id, "tableName", "columnName" from  prm."ModuleReleaseConditionType"
            WHERE "tableName"='${req.body.params.tableName}';`);
            try {
                var stringQR = `DELETE FROM prm."ModuleReleaseConditionType" WHERE "id" IN (`;
                if (data.rows.length > dataRqTable.length) {
                    // var checkDelete = false
                    for (let i in data.rows) {
                        var check = false;
                        for (let j in dataRqTable) {
                            if (data.rows[i].columnName === dataRqTable[j].columnName) {
                                check = true;
                                // checkDelete = true;
                                break;
                            }
                        }
                        if (!check) {
                            await db.query(`ALTER TABLE prm."${data.rows[i].tableName}"
                            DROP COLUMN IF EXISTS "${data.rows[i].columnName}",
                            DROP COLUMN IF EXISTS "${data.rows[i].columnName + "_From"}",
                            DROP COLUMN IF EXISTS "${data.rows[i].columnName + "_To"}";`);
                            if (stringQR.length === 60) {
                                stringQR += `'${data.rows[i].id}'`;
                            } else {
                                stringQR += `,'${data.rows[i].id}'`;
                            }
                        }
                        // check = false;
                    }
                    stringQR += ');';
                    if (stringQR.length > 62) {
                        await db.query(`${stringQR}`);

                    }
                    // console.log(stringQR);
                }
            } catch (error) {

            }

            for (let index in dataRqTable) {
                const dataRq = { ...dataRqTable[index] }
                var query = `SELECT to_regclass('prm."${dataRq.tableName}"');`
                let rsInsertTable = await db.query(query);
                var typeDB = '';

                if (!rsInsertTable.rows[0].to_regclass) {
                    // create table
                    if (dataRq.columnType === 'string' || dataRq.columnType === 'String' || dataRq.columnType === 'character varying') {
                        try {
                            if (Number(dataRq.length) > 0) {
                                typeDB = `"${dataRq.columnName + "_From"}" character varying(${dataRq.length}),
                            "${dataRq.columnName + "_To"}" character varying(${dataRq.length}),`
                            } else {
                                throw new Error('Type (string) must specify the length');
                            }
                        } catch (error) {
                            throw new Error(error);
                        }

                    } else if (dataRq.columnType === 'int' || dataRq.columnType === 'integer' || dataRq.columnType === 'Number') {
                        typeDB = `"${dataRq.columnName + "_From"}" bigint,
                    "${dataRq.columnName + "_To"}" integer,`
                    } else if (dataRq.columnType === 'boolean' || dataRq.columnType === 'Boolean') {
                        typeDB = `"${dataRq.columnName}" boolean,`
                    }

                    var queryCreate = `create table prm."${dataRq.tableName}" ( 
                    ${typeDB}
                "Release_ID" character varying(20),
                "Description" text,
                id SERIAL PRIMARY KEY,
                "createdAt" timestamp default now(),
                "changeAt" timestamp default now(),
                "createBy" character varying(10),
                "changeBy" character varying(10));`
                    await db.query(queryCreate);

                    await db.query(`INSERT INTO prm."ModuleReleaseConditionType" ("id","tableName", "columnName","Description","columnType","length","createAt","changeAt","createBy","changeBy")  
                select 
                unnest(array['${dataRq.tableName}${dataRq.columnName}']::character varying[]) as "id",
                unnest(array['${dataRq.tableName}']::character varying[]) as "tableName",
                unnest(array['${dataRq.columnName}']::character varying[]) as "columnName",
                unnest(array['${dataRq.Description}']::text[]) as "Description",
                unnest(array['${dataRq.columnType}']::character varying[]) as "columnType",
                unnest(array['${dataRq.length}']::integer[]) as "length",
                unnest(array['now()']::timestamp[]) as "createdAt",
                unnest(array['now()']::timestamp[]) as "changeAt",
                unnest(array['${userId}']::character varying[]) as "createBy",
                unnest(array['${userId}']::character varying[]) as "changeBy"
                ON CONFLICT ("id") DO UPDATE 
                  SET 
                    "columnName" = EXCLUDED."columnName",
                    "Description" = EXCLUDED."Description",
                    "columnType" = EXCLUDED."columnType",
                    "length" = EXCLUDED."length",
                    "changeAt"=EXCLUDED."changeAt",
                    "changeBy"=EXCLUDED."changeBy";`)
                } else {
                    //create column
                    //check column exits
                    var checkDelete = false;
                    var checkColumn = await db.query(`SELECT attname 
                FROM pg_attribute 
                WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = '${dataRq.tableName}') 
                AND attname = '${dataRq.columnName}' ;`)
                    if (checkColumn.rows.length !== 0 && dataRq.columnType !== 'boolean' && dataRq.columnType !== 'Boolean') {
                    //     await db.query(`ALTER TABLE prm."${dataRq.tableName}"
                    // DROP COLUMN IF EXISTS "${dataRq.columnName}",
                    // DROP COLUMN IF EXISTS "${dataRq.columnName + "_From"}",
                    // DROP COLUMN IF EXISTS "${dataRq.columnName + "_To"}";`);
                        checkDelete = true;
                    }
                    checkColumn = await db.query(`SELECT attname 
                FROM pg_attribute 
                WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = '${dataRq.tableName}') 
                AND ( attname = '${dataRq.columnName + "_From"}' OR attname = '${dataRq.columnName + "_To"}' ) ;`)
                if (checkColumn.rows.length !== 0 && (dataRq.columnType === 'boolean' || dataRq.columnType === 'Boolean')) {
                    //     await db.query(`ALTER TABLE prm."${dataRq.tableName}"
                    // DROP COLUMN IF EXISTS "${dataRq.columnName}",
                    // DROP COLUMN IF EXISTS "${dataRq.columnName + "_From"}",
                    // DROP COLUMN IF EXISTS "${dataRq.columnName + "_To"}";`);
                        checkDelete = true;
                    }

                    if(checkDelete){
                        await db.query(`ALTER TABLE prm."${dataRq.tableName}"
                        DROP COLUMN IF EXISTS "${dataRq.columnName}",
                        DROP COLUMN IF EXISTS "${dataRq.columnName + "_From"}",
                        DROP COLUMN IF EXISTS "${dataRq.columnName + "_To"}";`);
                    }
                    if (dataRq.columnType === 'string' || dataRq.columnType === 'String' || dataRq.columnType === 'character varying') {
                        try {
                            if (Number(dataRq.length) > 0) {
                                typeDB = `ADD COLUMN "${dataRq.columnName + "_From"}" character varying(${dataRq.length}),
                            ADD COLUMN "${dataRq.columnName + "_To"}" character varying(${dataRq.length})`
                            } else {
                                throw new Error('Type (string) must specify the length');
                            }
                        } catch (error) {
                            throw new Error(error);
                        }

                    } else if (dataRq.columnType === 'int' || dataRq.columnType === 'integer' || dataRq.columnType === 'Number') {
                        typeDB = `ADD COLUMN "${dataRq.columnName + "_From"}" integer,
                    ADD COLUMN "${dataRq.columnName + "_To"}" integer`
                    } else if (dataRq.columnType === 'boolean' || dataRq.columnType === 'Boolean') {
                        typeDB = `ADD COLUMN "${dataRq.columnName}" boolean`
                    }

                    var queryUpdate = `ALTER TABLE prm."${dataRq.tableName}" ${typeDB};`
                    try {
                        await db.query(queryUpdate);
                    } catch (error) {
                        
                    }
                    

                    await db.query(`INSERT INTO prm."ModuleReleaseConditionType" ("id","tableName", "columnName","Description","columnType","length","createAt","changeAt","createBy","changeBy")  
               select 
               unnest(array['${dataRq.tableName}${dataRq.columnName}']::character varying[]) as "id",
               unnest(array['${dataRq.tableName}']::character varying[]) as "tableName",
               unnest(array['${dataRq.columnName}']::character varying[]) as "columnName",
               unnest(array['${dataRq.Description}']::text[]) as "Description",
               unnest(array['${dataRq.columnType}']::character varying[]) as "columnType",
               unnest(array['${(dataRq.columnType === 'string' || dataRq.columnType === 'String' || dataRq.columnType === 'character varying') ? Number(dataRq.length) : 0}']::integer[]) as "length",
               unnest(array['now()']::timestamp[]) as "createdAt",
               unnest(array['now()']::timestamp[]) as "changeAt",
               unnest(array['${userId}']::character varying[]) as "createBy",
               unnest(array['${userId}']::character varying[]) as "changeBy"
               ON CONFLICT ("id") DO UPDATE 
                 SET 
                   "columnName" = EXCLUDED."columnName",
                   "Description" = EXCLUDED."Description",
                   "columnType" = EXCLUDED."columnType",
                   "length" = EXCLUDED."length",
                   "changeAt"=EXCLUDED."changeAt",
                   "changeBy"=EXCLUDED."changeBy";`)
                }
            }
            return 200;
        } catch (error) {
            throw new Error(error);
        }
    };

    getResults().then(results => {
        // process results here
        if (results === 200) {
            return res.status(200).json({ message: 'Success', code: 200 });
        } else {
            return res.status(401).json({ message: results.message, code: 401 });
        }
    }).catch(err => {
        // process error here
        return res.status(401).json({ message: err.message, code: 401 });
        // console.log(err);
    });
}
module.exports = {
    postReleaseConfigList: postReleaseConfigList,
}
