require('dotenv').config();
const crypt = require("../../crypt/crypt");
const decodeJWT = require('jwt-decode');
// const jwt = require("jsonwebtoken");
var sleep = require('sleep');
const db = require("../../db/db");
const apiSap = require("../../apiSap/apiSap");
const axios = require('axios');
const updateTable = require("./component/updateTablePrAndRelease");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
let updatePrSubmit = async (req, res) => {
	try {
		var checkStatus = await db.query(`select "STATUS" from prm."PrTable" where "PR_NO"=${req.body.params.dataPR.HEADER.PR_NO}`);
		if(checkStatus.rows[0].STATUS === 2){
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

		// if (req.body.params.dataPR.HEADER.PR_SAP !== '' && req.body.params.dataPR.HEADER.PR_SAP !== 0) {
		//update table Header 
		const dataItem = req.body.params.dataPR.ITEM;
		const leng = dataItem.length;
		if (leng === 0) {
			return res.status(404).json({ message: 'Yêu cầu có item!' });
		}
		var dataCallSap = req.body.params.dataPR;
		dataCallSap.HEADER.PR_SAP = req.body.params.dataPR.HEADER.PR_SAP;
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
		//update Header
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
		let api = await db.query(`select api from prm."API"`);
		if (api.rows.length > 0) {
			var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'PUT');
			dataCallSap.ITEM = data.data.ITEM;
			if (data.data.HEADER.TYPE === 'S') {
				// var rs = await updateTable.updateTablePrAndRelease(data.data,req,false);
				// // console.log(rs);
				// if(rs){
					//update ItemTable
					// var idMax = await db.query(`SELECT MAX(id)
					// FROM prm."PrItem";`)
					// var itemTable = []
					// var i = 1;
					// for(let index in dataItem){
					// 	let item = {...dataItem[index],...data.data.ITEM[index]};
					// 	if(Number(dataItem[index].id) === 0){
					// 		item.id = Number(idMax.rows[0].max) + i;
					// 		i ++
					// 	}
					// 	itemTable.push(item);
					// }
					// var PR_NO = []
					// var KNTTP = []
					// var PSTYP = []
					// var MATNR = []
					// var MATKL = []
					// var TXZ01 = []
					// var WERKS = []
					// var LGORT = []
					// var LFDAT = []
					// var LIFNR = []
					// var MENGE = []
					// var MEINS = []
					// var PREIS = []
					// var WEARS = []
					// var PEINH = []
					// var GSWRT = []
					// var EBELN = []
					// var EBELP = []
					// var LOEKZ = []
					// var EKORG = []
					// var EKGRP = []
					// var WEPOS = []
					// var WEUNB = []
					// var BLCKD = []
					// var REPOS = []
					// var BLCKT = []
					// var SAKTO = []
					// var KOSTL = []
					// var PRCTR = []
					// var ANLN1 = []
					// var ANLN2 = []
					// var AUFNR = []
					// var GSBER = []
					// var KOKRS = []
					// var GEBER = []
					// var FIPOS = []
					// var FKBER = []
					// var FISTL = []
					// var INFNR = []
					// var PR_ITEM = []
					// var id = []
					// for(let index in itemTable){
					// 	PR_NO.push(req.body.params.dataPR.HEADER.PR_NO)
					// 	KNTTP.push(itemTable[index].KNTTP)
					// 	PSTYP.push(itemTable[index].PSTYP)
					// 	MATNR.push(itemTable[index].MATNR)
					// 	MATKL.push(itemTable[index].MATKL)
					// 	TXZ01.push(itemTable[index].TXZ01)
		
					// 	WERKS.push(itemTable[index].WERKS)
					// 	LGORT.push(itemTable[index].LGORT)
					// 	LFDAT.push(itemTable[index].LFDAT)
					// 	LIFNR.push(itemTable[index].LIFNR)
					// 	MENGE.push(itemTable[index].MENGE)
					// 	MEINS.push(itemTable[index].MEINS)
		
					// 	PREIS.push(itemTable[index].PREIS)
					// 	WEARS.push(itemTable[index].WEARS)
					// 	PEINH.push(itemTable[index].PEINH)
					// 	GSWRT.push(itemTable[index].GSWRT)
					// 	EBELN.push(itemTable[index].EBELN)
					// 	EBELP.push(itemTable[index].EBELP)
		
					// 	LOEKZ.push(itemTable[index].LOEKZ)
					// 	EKORG.push(itemTable[index].EKORG)
					// 	EKGRP.push(itemTable[index].EKGRP)
					// 	WEPOS.push(itemTable[index].WEPOS)
					// 	WEUNB.push(itemTable[index].WEUNB)
					// 	BLCKD.push(itemTable[index].BLCKD)
		
					// 	REPOS.push(itemTable[index].REPOS)
					// 	BLCKT.push(itemTable[index].BLCKT)
					// 	SAKTO.push(itemTable[index].SAKTO)
					// 	KOSTL.push(itemTable[index].KOSTL)
					// 	PRCTR.push(itemTable[index].PRCTR)
					// 	ANLN1.push(itemTable[index].ANLN1)
		
					// 	ANLN2.push(itemTable[index].ANLN2)
					// 	AUFNR.push(itemTable[index].AUFNR)
					// 	GSBER.push(itemTable[index].GSBER)
					// 	KOKRS.push(itemTable[index].KOKRS)
					// 	GEBER.push(itemTable[index].GEBER)
					// 	FIPOS.push(itemTable[index].FIPOS)
		
					// 	FKBER.push(itemTable[index].FKBER)
					// 	FISTL.push(itemTable[index].FISTL)
					// 	INFNR.push(itemTable[index].INFNR)
					// 	PR_ITEM.push(itemTable[index].PR_ITEM)
					// 	id.push(itemTable[index].id)
		
					// }
					// var query = `INSERT INTO prm."PrItem" ("PR_NO","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
					// "MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
					// "BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR","PR_ITEM",id)
					// OVERRIDING SYSTEM VALUE 
					// select  
					// unnest($1::integer[]) as "PR_NO",          unnest($2::character varying[]) as "KNTTP",
					// unnest($3::character varying[]) as "PSTYP",unnest($4::character varying[]) as "MATNR",
					// unnest($5::character varying[]) as "MATKL",unnest($6::character varying[]) as "TXZ01",
					// unnest($7::character varying[]) as "WERKS",unnest($8::character varying[]) as "LGORT",
					// unnest($9::character varying[]) as "LFDAT",unnest($10::character varying[]) as "LIFNR",
		
					// unnest($11::character varying[]) as "MENGE",unnest($12::character varying[]) as "MEINS",
					// unnest($13::character varying[]) as "PREIS",unnest($14::character varying[]) as "WEARS",
					// unnest($15::character varying[]) as "PEINH",unnest($16::character varying[]) as "GSWRT",
					// unnest($17::character varying[]) as "EBELN",unnest($18::character varying[]) as "EBELP",
					// unnest($19::character varying[]) as "LOEKZ",unnest($20::character varying[]) as "EKORG",
					// unnest($21::character varying[]) as "EKGRP",unnest($22::character varying[]) as "WEPOS",
		
					// unnest($23::character varying[]) as "WEUNB",unnest($24::character varying[]) as "BLCKD",
					// unnest($25::character varying[]) as "REPOS",unnest($26::character varying[]) as "BLCKT",
					// unnest($27::character varying[]) as "SAKTO",unnest($28::character varying[]) as "KOSTL",
					// unnest($29::character varying[]) as "PRCTR",unnest($30::character varying[]) as "ANLN1",
					// unnest($31::character varying[]) as "ANLN2",unnest($32::character varying[]) as "AUFNR",
					// unnest($33::character varying[]) as "GSBER",unnest($34::character varying[]) as "KOKRS",
					// unnest($35::character varying[]) as "GEBER",unnest($36::character varying[]) as "FIPOS",
					// unnest($37::character varying[]) as "FKBER",unnest($38::character varying[]) as "FISTL",
					// unnest($39::character varying[]) as INFNR,
					// unnest($40::integer[]) as PR_ITEM,          unnest($41::bigint[]) as "id"
		
					// ON CONFLICT (id) DO UPDATE 
					//   SET 
					//   "PR_NO" = EXCLUDED."PR_NO","KNTTP" = EXCLUDED."KNTTP","PSTYP" = EXCLUDED."PSTYP","MATNR" = EXCLUDED."MATNR",
					//   "MATKL" = EXCLUDED."MATKL","TXZ01" = EXCLUDED."TXZ01","WERKS" = EXCLUDED."WERKS","LGORT" = EXCLUDED."LGORT",
					//   "LFDAT" = EXCLUDED."LFDAT","LIFNR" = EXCLUDED."LIFNR","MENGE" = EXCLUDED."MENGE","MEINS" = EXCLUDED."MEINS",
		
					//   "PREIS" = EXCLUDED."PREIS","WEARS" = EXCLUDED."WEARS","PEINH" = EXCLUDED."PEINH","GSWRT" = EXCLUDED."GSWRT",
					//   "EBELN" = EXCLUDED."EBELN","EBELP" = EXCLUDED."EBELP","LOEKZ" = EXCLUDED."LOEKZ","EKORG" = EXCLUDED."EKORG",
					//   "EKGRP" = EXCLUDED."EKGRP","WEPOS" = EXCLUDED."WEPOS","WEUNB" = EXCLUDED."WEUNB","BLCKD" = EXCLUDED."BLCKD",
		
					//   "REPOS" = EXCLUDED."REPOS","BLCKT" = EXCLUDED."BLCKT","SAKTO" = EXCLUDED."SAKTO","KOSTL" = EXCLUDED."KOSTL",
					//   "PRCTR" = EXCLUDED."PRCTR","ANLN1" = EXCLUDED."ANLN1","ANLN2" = EXCLUDED."ANLN2","AUFNR" = EXCLUDED."AUFNR",
					//   "GSBER" = EXCLUDED."GSBER","KOKRS" = EXCLUDED."KOKRS","GEBER" = EXCLUDED."GEBER","FIPOS" = EXCLUDED."FIPOS",
					//   "FKBER" = EXCLUDED."FKBER","FISTL" = EXCLUDED."FISTL","INFNR" = EXCLUDED."INFNR","PR_ITEM" = EXCLUDED."PR_ITEM"
					//   ;`
					// await db.query(query,[PR_NO,KNTTP,PSTYP,MATNR,MATKL,TXZ01,WERKS,LGORT,LFDAT,LIFNR,MENGE,MEINS,
					// 	PREIS,WEARS,PEINH,GSWRT,EBELN,EBELP,LOEKZ,EKORG,EKGRP,WEPOS,WEUNB,BLCKD,REPOS,BLCKT,SAKTO,KOSTL,
					// 	PRCTR,ANLN1,ANLN2,AUFNR,GSBER,KOKRS,GEBER,FIPOS,FKBER,FISTL,INFNR,PR_ITEM,id]);
					// 	rs.ITEM = itemTable;
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
						var data = await apiSap.apiSap(process.env.CIBER_PRM_API_SAP, dataCallSap, 'PUT');
						if (data.data.HEADER.TYPE === 'S') {
								var rs = await updateTable.updateTablePrAndRelease(data.data, req,dataCallSap,userId);
								// console.log(rs);
								if (rs.code !== 400) {
									// dataItem = rs.ITEM[0];
									var stringValue = `INSERT INTO prm."PrItem" ("PR_NO","PR_ITEM","KNTTP","PSTYP", "MATNR","MATKL","TXZ01","WERKS","LGORT","LFDAT","LIFNR",
								"MENGE","MEINS","PREIS","WEARS","PEINH","GSWRT","LOCAL_AMOUNT","EBELN","EBELP","LOEKZ","EKORG","EKGRP","WEPOS","WEUNB",
								"BLCKD","REPOS","BLCKT","SAKTO","KOSTL","PRCTR","ANLN1","ANLN2","AUFNR","GSBER","KOKRS","GEBER","FIPOS","FKBER","FISTL","INFNR") VALUES`;
									const leng = dataItem.length;
									for (let i in data.data.ITEM) {
										// dataItem[i]["PR_NO"] = req.body.params.dataPR.HEADER.PR_NO;
										var stringValueChiden = '';
										stringValueChiden = `('${data.data.ITEM[i].PR_NO}','${data.data.ITEM[i].PR_ITEM}','${data.data.ITEM[i].KNTTP}','${data.data.ITEM[i].PSTYP}','${data.data.ITEM[i].MATNR}','${data.data.ITEM[i].MATKL}','${data.data.ITEM[i].TXZ01}'
										,'${data.data.ITEM[i].WERKS}','${data.data.ITEM[i].LGORT}','${data.data.ITEM[i].LFDAT}','${data.data.ITEM[i].LIFNR}','${data.data.ITEM[i].MENGE}','${data.data.ITEM[i].MEINS}','${data.data.ITEM[i].PREIS}'
										,'${data.data.ITEM[i].WEARS}','${data.data.ITEM[i].PEINH}','${data.data.ITEM[i].GSWRT}','${data.data.ITEM[i].LOCAL_AMOUNT}','${data.data.ITEM[i].EBELN}','${data.data.ITEM[i].EBELP}','${data.data.ITEM[i].LOEKZ}'
										,'${data.data.ITEM[i].EKORG}','${data.data.ITEM[i].EKGRP}','${data.data.ITEM[i].WEPOS}','${data.data.ITEM[i].WEUNB}','${data.data.ITEM[i].BLCKD}','${data.data.ITEM[i].REPOS}','${data.data.ITEM[i].BLCKT}'
										,'${data.data.ITEM[i].SAKTO}','${data.data.ITEM[i].KOSTL}','${data.data.ITEM[i].PRCTR}','${data.data.ITEM[i].ANLN1}','${data.data.ITEM[i].ANLN2}','${data.data.ITEM[i].AUFNR}','${data.data.ITEM[i].GSBER}'
										,'${data.data.ITEM[i].KOKRS}','${data.data.ITEM[i].GEBER}','${data.data.ITEM[i].FIPOS}','${data.data.ITEM[i].FKBER}','${data.data.ITEM[i].FISTL}','${data.data.ITEM[i].INFNR}')`;
										if (leng > Number(i) + 1) {
											stringValueChiden += ','
										}
	
										stringValue += stringValueChiden;
									}
									await db.query(`${stringValue};`);
									return res.status(200).json(rs.data);
									// return res.status(200).json(data.data);
								}
								// return res.status(200).json(data.data);
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
					// return res.status(200).json(rs);
				// }
			} else {
				return res.status(404).json(data.data);
			}
			// console.log(data)
		} else {
			return res.status(404).json({ message: 'Không tìm thấy đường dẫn!' });
		}}else{
			return res.status(404).json({ message: 'Trạng thái hiện tại không cho phép!' });
		}
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}

}
module.exports = {
	updatePrSubmit: updatePrSubmit,
}