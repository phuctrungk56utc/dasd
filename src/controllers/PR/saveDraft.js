// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config();
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
// const axios = require('axios');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
 
let saveDraft = async (req, res) => {
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
        
        if(req.body.params.dataPR.HEADER.PR_NO !== 0){
            //update
            const dataItem = req.body.params.dataPR.ITEM;
            const leng = dataItem.length;
            if(leng === 0){
                return res.status(404).json({ message: 'Yêu cầu có item!' });
            }
            let queryHeader = `UPDATE prm."PrTable"
            SET
            "DESCRIPTION" = '${req.body.params.dataPR.HEADER.DESCRIPTION}',
            "BUKRS" = '${req.body.params.dataPR.HEADER.BUKRS}',
            "PR_TYPE" = '${req.body.params.dataPR.HEADER.PR_TYPE}',
            "WAERS" = '${req.body.params.dataPR.HEADER.WAERS === undefined ? '' : req.body.params.dataPR.HEADER.WAERS}',
            "HWAERS" = '${req.body.params.dataPR.HEADER.HWAERS  === undefined ? '' : req.body.params.dataPR.HEADER.HWAERS}',
            "changeAt"=now(),
            "changeBy"='${userId}'
            WHERE "PR_NO"=${req.body.params.dataPR.HEADER.PR_NO}
            RETURNING "changeAt";`
              var update = await db.query(`${queryHeader}`);

            if(update.rowCount > 0){
                var stringValue = `INSERT INTO prm."PrItem" ("PR_ITEM","PR_NO","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                

                for(let i in dataItem){
                    dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                    var stringValueChiden = '';
                    stringValueChiden = `('${dataItem[i].PR_ITEM}','${dataItem[i].PR_NO}','${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
                        ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
                        ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
                        ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
                        ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
                        ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}','${dataItem[i].INFNR}')`;
                    if(leng > Number(i)+1){
                        stringValueChiden += ','
                    }

                    stringValue += stringValueChiden;
                }
                await db.query(`DELETE FROM prm."PrItem"
                WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);

                await db.query(`${stringValue}`);
                
                return res.status(200).json({ message: 'success',dataHeader:{changeAt:update.rows[0].changeAt,PR_TYPE:req.body.params.dataPR.HEADER.PR_TYPE,
                    BUKRS:req.body.params.dataPR.HEADER.BUKRS,createBy:userId,PR_NO:req.body.params.dataPR.HEADER.PR_NO,
                DESCRIPTION:req.body.params.dataPR.HEADER.DESCRIPTION,STATUS:1}});
                // console.log('object');
            }else{
                return res.status(200).json({ message: 'Cập nhật thất bại!' });
            }

        }else{
            //insert
            const dataItem = req.body.params.dataPR.ITEM;
            const leng = dataItem.length;
            if(leng === 0){
                return res.status(404).json({ message: 'Yêu cầu có item!' });
            }
            let query =  `INSERT INTO prm."PrTable" ("PR_TYPE","BUKRS", "WAERS","HWAERS","DESCRIPTION","createBy","changeBy")
            VALUES ('${req.body.params.dataPR.HEADER.PR_TYPE}',
                '${req.body.params.dataPR.HEADER.BUKRS}',
                '${req.body.params.dataPR.HEADER.WAERS}',
                '${req.body.params.dataPR.HEADER.HWAERS}',
                '${req.body.params.dataPR.HEADER.DESCRIPTION}',
                '${userId}','${userId}')
                RETURNING "PR_NO","changeAt";`

                const id = await db.query(query);

                // const dataItem = req.body.params.dataPR.ITEM;

                var stringValue = `INSERT INTO prm."PrItem" ("PR_ITEM","PR_NO","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
                "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
                "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
                // const leng = dataItem.length
                for(let i in dataItem){
                    dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                    var stringValueChiden = '';
                    stringValueChiden = `('${dataItem[i].PR_ITEM}','${id.rows[0].PR_NO}','${dataItem[i].KNTTP}','${dataItem[i].PSTYP}','${dataItem[i].MATNR}','${dataItem[i].MATKL}','${dataItem[i].TXZ01}'
                        ,'${dataItem[i].WERKS}','${dataItem[i].LGORT}','${dataItem[i].LFDAT}','${dataItem[i].LIFNR}','${dataItem[i].MENGE}','${dataItem[i].MEINS}','${dataItem[i].PREIS}'
                        ,'${dataItem[i].WEARS}','${dataItem[i].PEINH}','${dataItem[i].GSWRT}','${dataItem[i].LOCAL_AMOUNT}','${dataItem[i].EBELN}','${dataItem[i].EBELP}','${dataItem[i].LOEKZ}'
                        ,'${dataItem[i].EKORG}','${dataItem[i].EKGRP}','${dataItem[i].WEPOS}','${dataItem[i].WEUNB}','${dataItem[i].BLCKD}','${dataItem[i].REPOS}','${dataItem[i].BLCKT}'
                        ,'${dataItem[i].SAKTO}','${dataItem[i].KOSTL}','${dataItem[i].PRCTR}','${dataItem[i].ANLN1}','${dataItem[i].ANLN2}','${dataItem[i].AUFNR}','${dataItem[i].GSBER}'
                        ,'${dataItem[i].KOKRS}','${dataItem[i].GEBER}','${dataItem[i].FIPOS}','${dataItem[i].FKBER}','${dataItem[i].FISTL}','${dataItem[i].INFNR}')`;
                    if(leng > Number(i)+1){
                        stringValueChiden += ','
                    }

                    stringValue += stringValueChiden;
                }
                // await db.query(`DELETE FROM prm."PrItem"
                // WHERE "PR_NO" = ${req.body.params.dataPR.HEADER.PR_NO};`);
                var updateTableItem = await db.query(`${stringValue} RETURNING "id";`);
                // var ITEM = []
                // for(let index in dataItem){
                //     let item = {...dataItem[index],...updateTableItem.rows[index]};
                //     ITEM.push(item);
                // }
                
                return res.status(200).json({ message: 'success',dataHeader:{PR_NO:id.rows[0].PR_NO,ACTION_CODE:1,createBy:userId,changeAt:id.rows[0].changeAt,STATUS:1,
                 PR_TYPE:req.body.params.dataPR.HEADER.PR_TYPE,BUKRS:req.body.params.dataPR.HEADER.BUKRS,DESCRIPTION:req.body.params.dataPR.HEADER.DESCRIPTION}});
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
		return res.status(404).json({ message: err.message });
	}

}
module.exports = {
	saveDraft: saveDraft,
}