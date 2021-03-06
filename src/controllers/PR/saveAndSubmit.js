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
    var dataItem = null
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
            dataItem = req.body.params.dataPR.ITEM;
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
            WHERE "PR_NO"=${req.body.params.dataPR.HEADER.PR_NO} RETURNING "changeAt";`

            const update = await db.query(query);
            if (update.rowCount > 0) {
                // await db.query(`DELETE FROM prm."PrItem"
                // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);

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
                // let api = await db.query(`select api from prm."API"`);
                // if (api.rows.length > 0) {
                    var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST');
                    if (data.data.length > 0) {
                        var checkError = false;
                        for (let index in data.data) {
                            if (data.data[index].HEADER.TYPE === 'E') {
                                checkError = true;
                                break;
                            }
                        }
                        if (!checkError) {
                            
                            var rs = await updateTable.updateTablePrAndRelease(data.data[0], req,dataCallSap,userId);
                            // console.log(rs);
                            if (rs.code && rs.code === 200) {
                                await db.query(`DELETE FROM prm."PrItem"
                                WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
                                // dataItem = rs.ITEM[0];
                                var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                            "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                            "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                                const leng = dataItem.length;
                                for (let i in dataItem) {
                                    // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
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
                                return res.status(200).json({data:data.data[0]});
                            }else{
                                await db.query(`DELETE FROM prm."PrItem"
                                WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
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
                                return res.status(201).json({data:rs.data,message:rs.message});
                            }
                            // return res.status(200).json(data.data);
                        }else{
                            await db.query(`DELETE FROM prm."PrItem"
                            WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
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

                            req.body.params.dataPR.HEADER.changeAt = update.rows[0].changeAt;
                            return res.status(404).json({data:data.data,dataHeader:req.body.params.dataPR.HEADER});
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
                        return res.status(200).json({ data:data.data,message: 'Tạo thất bại!' });
                    }
                // } else {
                //     return res.status(404).json({ message: 'Không tìm thấy đường dẫn!' });
                // }
                // return res.status(200).json({ message: 'success' });
                // console.log('object');
            } else {
                return res.status(404).json({data:data.data, message: 'Cập nhật thất bại!,Kiểm tra số PR' });
            }

        } else {
            //insert
            dataItem = req.body.params.dataPR.ITEM;
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
                RETURNING "PR_NO","changeAt";`

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
            // let api = await db.query(`select api from prm."API"`);
            // if (api.rows.length > 0) {
                var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'POST');
                if (data.data.length > 0) {
                    var checkError = false;
                    for (let index in data.data) {
                        if (data.data[index].HEADER.TYPE === 'E') {
                            checkError = true;
                            break;
                        }
                    }
                    if (!checkError) {
                        //check condition return release_ID
                        var rs = await updateTable.updateTablePrAndRelease(data.data[0], req,dataCallSap,userId);
                        // console.log(rs);
                        if (rs.code === 200) {
                            await db.query(`DELETE FROM prm."PrItem"
                            WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
                            // dataItem = rs.ITEM[0];
                            var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                        "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                        "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                            const leng = dataItem.length;
                            for (let i in dataItem) {
                                // dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
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
                            // data.data.HEADER.PR_TYPE = dataCallSap.HEADER.PR_TYPE;
                            return res.status(200).json({data:data.data[0]});
                        }else{
                            await db.query(`DELETE FROM prm."PrItem"
                            WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
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
                            return res.status(201).json({data:rs.data,message:rs.message});
                        }
                    }else{
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
                        return res.status(404).json({data:data.data,dataHeader:{PR_NO:id.rows[0].PR_NO,ACTION_CODE:1,createBy:userId,changeAt:id.rows[0].changeAt,STATUS:1,
                            PR_TYPE:req.body.params.dataPR.HEADER.PR_TYPE,BUKRS:req.body.params.dataPR.HEADER.BUKRS,DESCRIPTION:req.body.params.dataPR.HEADER.DESCRIPTION}});
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
                    return res.status(200).json({data:data.data, message: 'Tạo thất bại!' });
                }
            // }
        }

    } catch (error) {
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
        return res.status(404).json({ message: error.message });
    }

}
module.exports = {
    saveAndSubmit: saveAndSubmit,
}