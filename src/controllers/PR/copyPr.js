require('dotenv').config()
const crypt = require("../../crypt/crypt");
const db = require("../../db/db");
const decodeJWT = require('jwt-decode');
const socIo = require("../../../server");

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let copyPr = async (req, res) => {
	try {
        var userId = '';
		// var notification = socIo;
		try {
			const token = req.headers.authorization.split(' ')[1];
			const basicAuth = Buffer.from(token, 'base64').toString('ascii');
			userId = basicAuth.split(':')[0];
		} catch (error) {
			const accessToken = crypt.decrypt(req.headers.authorization);
			const decodeTk = decodeJWT(accessToken);
			userId = decodeTk.userId.toUpperCase();
		}
		const getPrHeader = await db.query(`select "PR_TYPE","BUKRS","DESCRIPTION" FROM prm."PrTable"
        WHERE "PR_NO" = ${req.body.params.PR_NO};`)
        const rs = await db.query(`INSERT INTO prm."PrTable"(
            "DESCRIPTION", "createBy", "changeBy", "STATUS", "StatusDescription", "PR_TYPE", "BUKRS", "createAt", "changeAt")
            VALUES ('${getPrHeader.rows[0].DESCRIPTION}', '${userId}', '${userId}', 1, 'Draft', '${getPrHeader.rows[0].PR_TYPE}', '${getPrHeader.rows[0].BUKRS}', 'now()', 'now()')
            RETURNING "PR_NO";`);

        const getPrItem = await db.query(`select * FROM prm."PrItem"
        WHERE "PR_NO" = ${req.body.params.PR_NO};`)
        const leng = getPrItem.rows.length
        if(leng > 0){
            var stringValue = `INSERT INTO prm."PrItem" ("PR_ITEM","PR_NO","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
            "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
            "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
            // const leng = dataItem.length
            for(let i in getPrItem.rows){
                // getPrItem.rows[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
                var stringValueChiden = '';
                stringValueChiden = `('${getPrItem.rows[i].PR_ITEM}','${rs.rows[0].PR_NO}','${getPrItem.rows[i].KNTTP}','${getPrItem.rows[i].PSTYP}','${getPrItem.rows[i].MATNR}','${getPrItem.rows[i].MATKL}','${getPrItem.rows[i].TXZ01}'
                    ,'${getPrItem.rows[i].WERKS}','${getPrItem.rows[i].LGORT}','${getPrItem.rows[i].LFDAT}','${getPrItem.rows[i].LIFNR}','${getPrItem.rows[i].MENGE}','${getPrItem.rows[i].MEINS}','${getPrItem.rows[i].PREIS}'
                    ,'${getPrItem.rows[i].WEARS}','${getPrItem.rows[i].PEINH}','${getPrItem.rows[i].GSWRT}','${getPrItem.rows[i].LOCAL_AMOUNT}','${getPrItem.rows[i].EBELN}','${getPrItem.rows[i].EBELP}','${getPrItem.rows[i].LOEKZ}'
                    ,'${getPrItem.rows[i].EKORG}','${getPrItem.rows[i].EKGRP}','${getPrItem.rows[i].WEPOS}','${getPrItem.rows[i].WEUNB}','${getPrItem.rows[i].BLCKD}','${getPrItem.rows[i].REPOS}','${getPrItem.rows[i].BLCKT}'
                    ,'${getPrItem.rows[i].SAKTO}','${getPrItem.rows[i].KOSTL}','${getPrItem.rows[i].PRCTR}','${getPrItem.rows[i].ANLN1}','${getPrItem.rows[i].ANLN2}','${getPrItem.rows[i].AUFNR}','${getPrItem.rows[i].GSBER}'
                    ,'${getPrItem.rows[i].KOKRS}','${getPrItem.rows[i].GEBER}','${getPrItem.rows[i].FIPOS}','${getPrItem.rows[i].FKBER}','${getPrItem.rows[i].FISTL}','${getPrItem.rows[i].INFNR}')`;
                if(leng > Number(i)+1){
                    stringValueChiden += ','
                }

                stringValue += stringValueChiden;
            }
        //rs.rows[0].PR_NO
        await db.query(stringValue);
    }
        return res.status(200).json({ message: 'success' });
	} catch (error) {
        return res.status(404).json({ message: error });
	}

}
module.exports = {
	copyPr: copyPr,
}
