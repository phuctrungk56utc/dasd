require('dotenv').config();
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
const axios = require('axios');
const apiSap = require("../../apiSap/apiSap");
const updateTable = require("./component/updateTablePrAndRelease");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let saveAndSubmit = async (req, res) => {
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
                await db.query(`DELETE FROM prm."PrItem"
                WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);

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
                    var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST');
                    if (data.data.length > 0) {

                        if (data.data[0].HEADER.TYPE === 'S') {
                            var rs = await updateTable.updateTablePrAndRelease(data.data[0], req,dataCallSap,userId);
                            // console.log(rs);
                            if (rs) {
                                // dataItem = rs.ITEM[0];
                                var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                            "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                            "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                                const leng = dataItem.length;
                                for (let i in dataItem) {
                                    // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                                    var stringValueChiden = '';
                                    stringValueChiden = `('${rs.ITEM[i].PR_NO}','${rs.ITEM[i].PR_ITEM}','${rs.ITEM[i].KNTTP}','${rs.ITEM[i].PSTYP}','${rs.ITEM[i].MATNR}','${rs.ITEM[i].MATKL}','${rs.ITEM[i].TXZ01}'
                                    ,'${rs.ITEM[i].WERKS}','${rs.ITEM[i].LGORT}','${rs.ITEM[i].LFDAT}','${rs.ITEM[i].LIFNR}','${rs.ITEM[i].MENGE}','${rs.ITEM[i].MEINS}','${rs.ITEM[i].PREIS}'
                                    ,'${rs.ITEM[i].WEARS}','${rs.ITEM[i].PEINH}','${rs.ITEM[i].GSWRT}','${rs.ITEM[i].LOCAL_AMOUNT}','${rs.ITEM[i].EBELN}','${rs.ITEM[i].EBELP}','${rs.ITEM[i].LOEKZ}'
                                    ,'${rs.ITEM[i].EKORG}','${rs.ITEM[i].EKGRP}','${rs.ITEM[i].WEPOS}','${rs.ITEM[i].WEUNB}','${rs.ITEM[i].BLCKD}','${rs.ITEM[i].REPOS}','${rs.ITEM[i].BLCKT}'
                                    ,'${rs.ITEM[i].SAKTO}','${rs.ITEM[i].KOSTL}','${rs.ITEM[i].PRCTR}','${rs.ITEM[i].ANLN1}','${rs.ITEM[i].ANLN2}','${rs.ITEM[i].AUFNR}','${rs.ITEM[i].GSBER}'
                                    ,'${rs.ITEM[i].KOKRS}','${rs.ITEM[i].GEBER}','${rs.ITEM[i].FIPOS}','${rs.ITEM[i].FKBER}','${rs.ITEM[i].FISTL}','${rs.ITEM[i].INFNR}')`;
                                    if (leng > Number(i) + 1) {
                                        stringValueChiden += ','
                                    }

                                    stringValue += stringValueChiden;
                                }
                                await db.query(`${stringValue};`);
                                return res.status(200).json(data.data);
                            }
                            // return res.status(200).json(data.data);
                        }
                    } else {
                        var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                    "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                    "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                        const leng = dataItem.length
                        for (let i in dataItem) {
                            dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                            var stringValueChiden = '';
                            stringValueChiden = `('${dataItem[i].PR_NO}','${dataItem[i].PR_ITEM}','${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
                            ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
                            ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
                            ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
                            ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
                            ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}','${dataItem[i].INFNR}')`;
                            if (leng > Number(i) + 1) {
                                stringValueChiden += ','
                            }

                            stringValue += stringValueChiden;
                        }
                        await db.query(`${stringValue};`);
                        return res.status(200).json({ message: 'Tạo thất bại!' });
                    }
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
                var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST');
                if (data.data.length > 0) {
                    var checkError = false;
                    for (let index in data.data) {
                        if (data.data[index].HEADER.TYPE === 'E') {
                            checkError = true;
                        }
                    }
                    if (!checkError) {
                        //check condition return release_ID
                        var rs = await updateTable.updateTablePrAndRelease(data.data[0], req,dataCallSap,userId);
                        // console.log(rs);
                        if (rs) {
                            // dataItem = rs.ITEM[0];
                            var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                        "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                        "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                            const leng = dataItem.length;
                            for (let i in dataItem) {
                                // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                                var stringValueChiden = '';
                                stringValueChiden = `('${rs.ITEM[i].PR_NO}','${rs.ITEM[i].PR_ITEM}','${rs.ITEM[i].KNTTP}','${rs.ITEM[i].PSTYP}','${rs.ITEM[i].MATNR}','${rs.ITEM[i].MATKL}','${rs.ITEM[i].TXZ01}'
                                ,'${rs.ITEM[i].WERKS}','${rs.ITEM[i].LGORT}','${rs.ITEM[i].LFDAT}','${rs.ITEM[i].LIFNR}','${rs.ITEM[i].MENGE}','${rs.ITEM[i].MEINS}','${rs.ITEM[i].PREIS}'
                                ,'${rs.ITEM[i].WEARS}','${rs.ITEM[i].PEINH}','${rs.ITEM[i].GSWRT}','${rs.ITEM[i].LOCAL_AMOUNT}','${rs.ITEM[i].EBELN}','${rs.ITEM[i].EBELP}','${rs.ITEM[i].LOEKZ}'
                                ,'${rs.ITEM[i].EKORG}','${rs.ITEM[i].EKGRP}','${rs.ITEM[i].WEPOS}','${rs.ITEM[i].WEUNB}','${rs.ITEM[i].BLCKD}','${rs.ITEM[i].REPOS}','${rs.ITEM[i].BLCKT}'
                                ,'${rs.ITEM[i].SAKTO}','${rs.ITEM[i].KOSTL}','${rs.ITEM[i].PRCTR}','${rs.ITEM[i].ANLN1}','${rs.ITEM[i].ANLN2}','${rs.ITEM[i].AUFNR}','${rs.ITEM[i].GSBER}'
                                ,'${rs.ITEM[i].KOKRS}','${rs.ITEM[i].GEBER}','${rs.ITEM[i].FIPOS}','${rs.ITEM[i].FKBER}','${rs.ITEM[i].FISTL}','${rs.ITEM[i].INFNR}')`;
                                if (leng > Number(i) + 1) {
                                    stringValueChiden += ','
                                }

                                stringValue += stringValueChiden;
                            }
                            await db.query(`${stringValue};`);
                            // data.data.HEADER.PR_TYPE = dataCallSap.HEADER.PR_TYPE;
                            return res.status(200).json(data.data);
                        }
                    }
                    return res.status(200).json(data.data);
                } else {
                    var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                    const leng = dataItem.length
                    for (let i in dataItem) {
                        dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                        var stringValueChiden = '';
                        stringValueChiden = `('${dataItem[i].PR_NO}','${dataItem[i].PR_ITEM}','${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
                        ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
                        ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
                        ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
                        ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
                        ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}','${dataItem[i].INFNR}')`;
                        if (leng > Number(i) + 1) {
                            stringValueChiden += ','
                        }

                        stringValue += stringValueChiden;
                    }
                    await db.query(`${stringValue};`);
                    return res.status(200).json({ message: 'Tạo thất bại!' });
                }
            }
        }

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}
module.exports = {
    saveAndSubmit: saveAndSubmit,
}