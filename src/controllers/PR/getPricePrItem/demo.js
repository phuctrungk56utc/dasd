require('dotenv').config();
const crypt = require("../../../crypt/crypt");
const decodeJWT = require('jwt-decode');
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../../db/db");
const axios = require('axios');
const apiSap = require("../../../apiSap/apiSap");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let abcd = async (req, res) => {
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

        if (req.body.params.dataPR.HEADER.PR_NO !== '' && req.body.params.dataPR.HEADER.PR_NO !== 0) {
            //update table Header 
            const dataItem = req.body.params.dataPR.ITEM;
            const leng = dataItem.length;
            if (leng === 0) {
                return res.status(404).json({ message: 'Yêu cầu có item!' });
            }
            var bukrs = '';
            if (req.body.params.dataPR.HEADER.BUKRS !== undefined) {
                bukrs = req.body.params.dataPR.HEADER.BUKRS;
            }
            var waers = '';
            if (req.body.params.dataPR.HEADER.WAERS !== undefined) {
                waers = req.body.params.dataPR.HEADER.WAERS;
            }
            var hwaers = '';
            if (req.body.params.dataPR.HEADER.HWAERS !== undefined) {
                hwaers = req.body.params.dataPR.HEADER.HWAERS;
            }
            let query = `UPDATE prm."PrTable"
            SET
            "DESCRIPTION" = '${req.body.params.dataPR.HEADER.DESCRIPTION}',
            "BUKRS" = '${bukrs}',
            "PR_TYPE" = '${req.body.params.dataPR.HEADER.PR_TYPE}',
            "WAERS" = '${waers}',
            "HWAERS" = '${hwaers}',
            "changeAt"=now(),
            "changeBy"='${userId}'
            WHERE "PR_NO"=${req.body.params.dataPR.HEADER.PR_NO};`

            const update = await db.query(query);
            if (update.rowCount > 0) {


                var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL") VALUES`;
                const leng = dataItem.length
                for (let i in dataItem) {
                    dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                    var stringValueChiden = '';
                    stringValueChiden = `('${dataItem[i].PR_NO}',${dataItem[i].PR_ITEM},'${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
                        ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
                        ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
                        ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
                        ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
                        ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}')`;
                    if (leng > Number(i) + 1) {
                        stringValueChiden += ','
                    }

                    stringValue += stringValueChiden;
                }
                await db.query(`DELETE FROM prm."PrItem"
                WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
                await db.query(`${stringValue};`);

                //call api sap
                var dataCallSap = req.body.params.dataPR;
                for (let index in dataCallSap.ITEM) {
                    dataCallSap.ITEM[index].PR_NO = req.body.params.dataPR.HEADER.PR_NO;
                }
                //get condition
                var cd = [];
                const conDition = await db.query(`select "columnName" from prm."ModuleReleaseConditionType" WHERE "tableName" = 'PR';`);
                for (let index in conDition.rows) {
                    let ob = {};
                    ob.FIELD_NAME = conDition.rows[index].columnName;
                    cd.push(ob);
                }
                dataCallSap.COND_RELEASE = cd;
                let api = await db.query(`select api from prm."API"`);
                if (api.rows.length > 0) {
                    // var username = 'giangph';
                    // var password = '1234567';
                    // // var credentials = btoa(username + ':' + password);
                    // // var basicAuth = 'Basic ' + credentials;

                    // const options = {
                    //     method: 'POST',
                    //     auth: {
                    //         username: username,
                    //         password: password
                    //     },
                    //     headers: {
                    //         xsrfCookieName: 'XSRF-TOKEN',
                    //         xsrfHeaderName: 'X-XSRF-TOKEN',
                    //         "X-XSRF-TOKEN": 'ZoJgPjA294f2JdEV1bLyzQ==',
                    //         "x-csrf-token": 'Fetch',
                    //         "Content-Type": "application/x-www-form-urlencoded"
                    //     },
                    //     data: dataCallSap,
                    //     url: `http://124.158.7.54:8007/sap/bc/zwebservice/zpr_api?sap-client=200`,
                    // };
                    var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP,dataCallSap,'POST');
                    const data = await axios(options);
                    if (data.data[0].HEADER.TYPE === 'S') {
                        //update to table
                        let stringRelease = `select "Release_ID" from prm."PR" WHERE `;
                        var lengX = data.data[0].COND_RELEASE.length;
                        for (let index in data.data[0].COND_RELEASE) {
                            // stringRelease += `"${data.data[0].COND_RELEASE[index].FIELD_NAME}_From" <= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}' AND
                            // "${data.data[0].COND_RELEASE[index].FIELD_NAME}_To" >= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}'`

                            var stringValueChiden = '';
                            stringValueChiden = `"${data.data[0].COND_RELEASE[index].FIELD_NAME}_From" <= ${data.data[0].COND_RELEASE[index].FIELD_VALUE} AND
                            "${data.data[0].COND_RELEASE[index].FIELD_NAME}_To" >= ${data.data[0].COND_RELEASE[index].FIELD_VALUE}`;
                            if (lengX > Number(index) + 1) {
                                stringValueChiden += 'AND'
                            }

                            stringRelease += stringValueChiden;
                        }
                        var release_ID = await db.query(`${stringRelease};`);
                        //update status draft to submit
                        //have release 
                        if(release_ID.rows.length === 0){

                        //no release to status comp
                        rs = await db.query(`UPDATE prm."PrTable"
                                                SET "PR_SAP"=${data.data[0].HEADER.PR_SAP}, "DESCRIPTION"='${dataCallSap.HEADER.DESCRIPTION}', "changeBy"='${userId}',"STATUS"=5, 
                                                "StatusDescription"='Complete', "LOCAL_AMOUNT"=${data.data[0].HEADER.LOCAL_AMOUNT}, 
                                                "WAERS"='${data.data[0].HEADER.WAERS ? data.data[0].HEADER.WAERS: ''}', "HWAERS"='${data.data[0].HEADER.HWAERS ? data.data[0].HEADER.HWAERS: ''}', 
                                                "changeAt"=now(), "Release_ID"=''
                                                WHERE "PR_NO"=${data.data[0].HEADER.PR_NO} RETURNING "createBy", "changeAt", "STATUS";`);
                                                data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
                                                data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
                                                data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
                                                data.data[0].HEADER.createBy = rs.rows[0].createBy;
                                                data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
                                                data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
                                                return res.status(200).json(data.data);
                        }
                        else{
                            rs = await db.query(`UPDATE prm."PrTable"
                            SET "PR_SAP" = ${data.data[0].HEADER.PR_SAP},"STATUS"=2,"LOCAL_AMOUNT" = ${data.data[0].HEADER.LOCAL_AMOUNT},
                            "Release_ID"='${release_ID.rows[0].Release_ID}',
                            "HWAERS"='${data.data[0].HEADER.HWAERS}'
                            WHERE "PR_NO"=${data.data[0].HEADER.PR_NO} RETURNING "createBy", "changeAt", "STATUS"`);
                            data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
                            data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
                            data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
                            data.data[0].HEADER.createBy = rs.rows[0].createBy;
                            data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
                            data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
                            data.data[0].HEADER.PR_TYPE = rs.rows[0].STATUS;

                            var userRl = await db.query(`select "Release_Level", "userId" from prm."Strategy" WHERE "Release_ID" = '${release_ID.rows[0].Release_ID}' `);

                            var query_PR_RL_STRA = `INSERT INTO prm."PR_RELEASE_STRATEGY" ("PR_NO","userId","RELEASE_LEVEL") VALUES`;
                            var lengX = userRl.rows.length;
                            for (let index in userRl.rows) {
                                var stringValueChiden = '';
                                stringValueChiden = `(${data.data[0].HEADER.PR_NO},'${userRl.rows[index].userId}','${userRl.rows[index].Release_Level}')`;
                                if (lengX > Number(index) + 1) {
                                    stringValueChiden += ','
                                }
                                query_PR_RL_STRA += stringValueChiden;
                            }
                            await db.query(`${query_PR_RL_STRA};`);
                            //update PR Item
                            return res.status(200).json(data.data);
                        }
                    } 
                    return res.status(404).json({ message: 'Cập nhật thất bại!' });
                    // console.log(data)
                } else {
                    return res.status(404).json({ message: 'Không tìm thấy đường dẫn!' });
                }
                // return res.status(200).json({ message: 'success' });
                // console.log('object');
            } else {
                return res.status(404).json({ message: 'Cập nhật thất bại!,Kiểm tra số PR' });
            }

        } else {
            //insert
            const dataItem = req.body.params.dataPR.ITEM;
            const leng = dataItem.length;
            if (leng === 0) {
                return res.status(404).json({ message: 'Yêu cầu có item!' });
            }
            var bukrs = '';
            if (req.body.params.dataPR.HEADER.BUKRS !== undefined) {
                bukrs = req.body.params.dataPR.HEADER.BUKRS;
            }
            var waers = '';
            if (req.body.params.dataPR.HEADER.WAERS !== undefined) {
                waers = req.body.params.dataPR.HEADER.WAERS;
            }
            var hwaers = '';
            if (req.body.params.dataPR.HEADER.HWAERS !== undefined) {
                hwaers = req.body.params.dataPR.HEADER.HWAERS;
            }
            let query = `INSERT INTO prm."PrTable" ("PR_TYPE","BUKRS", "WAERS","HWAERS","DESCRIPTION","createBy","changeBy")
            VALUES ('${req.body.params.dataPR.HEADER.PR_TYPE}',
                '${bukrs}',
                '${waers}',
                '${hwaers}',
                '${req.body.params.dataPR.HEADER.DESCRIPTION}',
                '${userId}','${userId}')
                RETURNING "PR_NO";`

            const id = await db.query(query);

            var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL") VALUES`;
            // const leng = dataItem.length
            for (let i in dataItem) {
                dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                var stringValueChiden = '';
                stringValueChiden = `('${id.rows[0].PR_NO}',${dataItem[i].PR_ITEM},'${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
                        ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
                        ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
                        ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
                        ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
                        ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}')`;
                if (leng > Number(i) + 1) {
                    stringValueChiden += ','
                }

                stringValue += stringValueChiden;
            }
            // await db.query(`DELETE FROM prm."PrItem"
            // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
            await db.query(`${stringValue};`);

            //call api sap
            var dataCallSap = req.body.params.dataPR;

            for (let index in dataCallSap.ITEM) {
                dataCallSap.ITEM[index].PR_NO = id.rows[0].PR_NO;
            }
            //get condition
            var cd = [];
            const conDition = await db.query(`select "columnName" from prm."ModuleReleaseConditionType" WHERE "tableName" = 'PR';`);
            for (let index in conDition.rows) {
                let ob = {};
                ob.FIELD_NAME = conDition.rows[index].columnName;
                cd.push(ob);
            }
            dataCallSap.COND_RELEASE = cd;
            dataCallSap.HEADER.PR_NO = id.rows[0].PR_NO;
            let api = await db.query(`select api from prm."API"`);
            if (api.rows.length > 0) {
                var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP,dataCallSap,'POST');
                var checkError = false;
                for (let index in data.data) {
                    if (data.data[index].HEADER.TYPE === 'E') {
                        checkError = true;
                    }
                }
                var rs = null;
                if (!checkError) {
                    //check condition return release_ID
                    let stringRelease = `select "Release_ID" from prm."PR" WHERE `;
                    var lengX = data.data[0].COND_RELEASE.length;
                    for (let index in data.data[0].COND_RELEASE) {
                        // stringRelease += `"${data.data[0].COND_RELEASE[index].FIELD_NAME}_From" <= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}' AND
                        // "${data.data[0].COND_RELEASE[index].FIELD_NAME}_To" >= '${data.data[0].COND_RELEASE[index].FIELD_VALUE}'`

                        var stringValueChiden = '';
                        stringValueChiden = `"${data.data[0].COND_RELEASE[index].FIELD_NAME}_From" <= ${data.data[0].COND_RELEASE[index].FIELD_VALUE} AND
                        "${data.data[0].COND_RELEASE[index].FIELD_NAME}_To" >= ${data.data[0].COND_RELEASE[index].FIELD_VALUE}`;
                        if (lengX > Number(index) + 1) {
                            stringValueChiden += 'AND'
                        }

                        stringRelease += stringValueChiden;
                    }
                    var release_ID = await db.query(`${stringRelease};`);
                    //update status draft to submit
                    //have release 
                    if (release_ID.rows.length === 0) {
                        //no release to status comp
                        rs = await db.query(`UPDATE prm."PrTable"
                                                SET "PR_SAP"=${data.data[0].HEADER.PR_SAP}, "DESCRIPTION"='${dataCallSap.HEADER.DESCRIPTION}', "changeBy"='${userId}',"STATUS"=5, 
                                                "StatusDescription"='Complete', "LOCAL_AMOUNT"=${data.data[0].HEADER.LOCAL_AMOUNT}, 
                                                "WAERS"='${data.data[0].HEADER.WAERS ? data.data[0].HEADER.WAERS: ''}', "HWAERS"='${data.data[0].HEADER.HWAERS ? data.data[0].HEADER.HWAERS: ''}', 
                                                "changeAt"=now(), "Release_ID"=''
                                                WHERE "PR_NO"=${data.data[0].HEADER.PR_NO} RETURNING "createBy", "changeAt", "STATUS";`);
                                                data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
                                                data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
                                                data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
                                                data.data[0].HEADER.createBy = rs.rows[0].createBy;
                                                data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
                                                data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
                                                return res.status(200).json(data.data);
                    } else {
                        rs = await db.query(`UPDATE prm."PrTable"
                        SET "PR_SAP" = ${data.data[0].HEADER.PR_SAP},"STATUS"=2,"LOCAL_AMOUNT" = ${data.data[0].HEADER.LOCAL_AMOUNT},
                        "Release_ID"='${release_ID.rows[0].Release_ID}',
                        "HWAERS"='${data.data[0].HEADER.HWAERS}'
                        WHERE "PR_NO"=${id.rows[0].PR_NO} RETURNING "createBy", "changeAt", "STATUS","DESCRIPTION"`);
                        data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
                        data.data[0].HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
                        data.data[0].HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
                        data.data[0].HEADER.createBy = rs.rows[0].createBy;
                        data.data[0].HEADER.changeAt = rs.rows[0].changeAt;
                        data.data[0].HEADER.STATUS = rs.rows[0].STATUS;
                        // data.data[0].ITEM = 

                        var userRl = await db.query(`select "Release_Level", "userId" from prm."Strategy" WHERE "Release_ID" = '${release_ID.rows[0].Release_ID}'`);

                        var query_PR_RL_STRA = `INSERT INTO prm."PR_RELEASE_STRATEGY" ("PR_NO","userId","RELEASE_LEVEL") VALUES`;
                        var lengX = userRl.rows.length;
                        for (let index in userRl.rows) {
                            var stringValueChiden = '';
                            stringValueChiden = `(${id.rows[0].PR_NO},'${userRl.rows[index].userId}','${userRl.rows[index].Release_Level}')`;
                            if (lengX > Number(index) + 1) {
                                stringValueChiden += ','
                            }
                            query_PR_RL_STRA += stringValueChiden;
                        }
                        await db.query(`${query_PR_RL_STRA};`)
                        // console.log(userRl)
                        data.data[0].HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
                        return res.status(200).json(data.data);
                    }

                }

                return res.status(200).json(data.data);
            }
            // return res.status(200).json({ message: 'success' });
        }

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}
module.exports = {
    abcd: abcd,
}