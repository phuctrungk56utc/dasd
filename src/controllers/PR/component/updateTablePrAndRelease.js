// const jwtHelper = require("../helpers/jwt.helper");
// const debug = console.log.bind(console);
// const crypt = require("../crypt/crypt");
require('dotenv').config()
// var sleep = require('sleep');
const db = require("../../../db/db");
const socIo = require("../../../../server");
const axios = require('axios');
// const apiSap = require("../../../apiSap/apiSap");
// const axios = require('axios')
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */

let updateTablePrAndRelease = async (resultSap, req, dataCallSap,userId) => {
    try {
        var notification = socIo;

        let stringRelease = `select "Release_ID" from prm."PR" WHERE `;
        var lengX = resultSap.COND_RELEASE.length;
        for (let index in resultSap.COND_RELEASE) {
            var stringValueChidden = '';
            stringValueChidden = `"${resultSap.COND_RELEASE[index].FIELD_NAME}_From" <= ${resultSap.COND_RELEASE[index].FIELD_VALUE} AND
                                       "${resultSap.COND_RELEASE[index].FIELD_NAME}_To" >= ${resultSap.COND_RELEASE[index].FIELD_VALUE}`;
            if (lengX > Number(index) + 1) {
                stringValueChidden += 'AND'
            }

            stringRelease += stringValueChidden;
        }
        var release_ID = await db.query(`${stringRelease};`);
        if(release_ID.rows.length === 0){
                        //no release to status comp
                        var rs = await db.query(`UPDATE prm."PrTable"
                        SET "PR_SAP"=${resultSap.HEADER.PR_SAP}, "DESCRIPTION"='${dataCallSap.HEADER.DESCRIPTION}', "changeBy"='${userId}',"STATUS"=5, 
                        "StatusDescription"='Complete', "LOCAL_AMOUNT"=${resultSap.HEADER.LOCAL_AMOUNT}, 
                        "WAERS"='${resultSap.HEADER.WAERS ? resultSap.HEADER.WAERS : ''}', "HWAERS"='${resultSap.HEADER.HWAERS ? resultSap.HEADER.HWAERS : ''}', 
                        "changeAt"=now(), "Release_ID"=''
                        WHERE "PR_NO"=${resultSap.HEADER.PR_NO} RETURNING "createBy", "changeAt", "STATUS";`);
                    resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
                    resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
                    resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
                    resultSap.HEADER.createBy = rs.rows[0].createBy;
                    resultSap.HEADER.changeAt = rs.rows[0].changeAt;
                    resultSap.HEADER.STATUS = rs.rows[0].STATUS;
                    return ({code:400,data:resultSap,message:'not found Release_ID'});
            // return ({code:400,message:'not found Release_ID'});
        }
        //update status draft to submit
        //have release 
        var userRl = await db.query(`select "Release_Level", "userId" from prm."Strategy" WHERE "Release_ID" = '${release_ID.rows[0].Release_ID}' and "ReleaseType" = 'PR'`);

        var lengX = userRl.rows.length;
        if (release_ID.rows.length === 0 || lengX === 0) {
            //no release to status comp
            var rs = await db.query(`UPDATE prm."PrTable"
                SET "PR_SAP"=${resultSap.HEADER.PR_SAP}, "DESCRIPTION"='${dataCallSap.HEADER.DESCRIPTION}', "changeBy"='${userId}',"STATUS"=5, 
                "StatusDescription"='Complete', "LOCAL_AMOUNT"=${resultSap.HEADER.LOCAL_AMOUNT}, 
                "WAERS"='${resultSap.HEADER.WAERS ? resultSap.HEADER.WAERS : ''}', "HWAERS"='${resultSap.HEADER.HWAERS ? resultSap.HEADER.HWAERS : ''}', 
                "changeAt"=now(), "Release_ID"=''
                WHERE "PR_NO"=${resultSap.HEADER.PR_NO} RETURNING "createBy", "changeAt", "STATUS";`);
            resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
            resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
            resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
            resultSap.HEADER.createBy = rs.rows[0].createBy;
            resultSap.HEADER.changeAt = rs.rows[0].changeAt;
            resultSap.HEADER.STATUS = rs.rows[0].STATUS;
            return ({code:200,data:resultSap});
        }
        else {
            var rs = await db.query(`UPDATE prm."PrTable"
                SET "PR_SAP" = ${resultSap.HEADER.PR_SAP},"STATUS"=2,"LOCAL_AMOUNT" = ${resultSap.HEADER.LOCAL_AMOUNT},
                "Release_ID"='${release_ID.rows[0].Release_ID}',
                "HWAERS"='${resultSap.HEADER.HWAERS}'
                WHERE "PR_NO"=${resultSap.HEADER.PR_NO} RETURNING "createBy", "changeAt", "STATUS"`);
            resultSap.HEADER.PR_TYPE = req.body.params.dataPR.HEADER.PR_TYPE;
            resultSap.HEADER.BUKRS = req.body.params.dataPR.HEADER.BUKRS;
            resultSap.HEADER.DESCRIPTION = req.body.params.dataPR.HEADER.DESCRIPTION;
            resultSap.HEADER.createBy = rs.rows[0].createBy;
            resultSap.HEADER.changeAt = rs.rows[0].changeAt;
            resultSap.HEADER.STATUS = rs.rows[0].STATUS;

            // var userRl = await db.query(`select "Release_Level", "userId" from prm."Strategy" WHERE "Release_ID" = '${release_ID.rows[0].Release_ID}' and "ReleaseType" = 'PR'`);
            // var lengX = userRl.rows.length;
            // if(isUpdateSubmit){
            await db.query(`DELETE FROM prm."PR_RELEASE_STRATEGY"
                WHERE "PR_NO"=${resultSap.HEADER.PR_NO};`)
            var query_PR_RL_STRA = `INSERT INTO prm."PR_RELEASE_STRATEGY" ("PR_NO","userId","RELEASE_LEVEL") VALUES`;
            var stringValueNoti = `INSERT INTO prm."Notification"(
                    "forUserId","FromUserId","PR_NO", "StatusCode", "StatusDescription", "createAt", "changeAt", "NotiTypeDescription", "NotiType")
                    VALUES`;
            var checkInsertNotification = 1;
            const dataPushNotificationMobile = await db.query(`SELECT * FROM prm."NotificationMobileKey";`);
            for (let index in userRl.rows) {
                //push notification
                var today = new Date();
                try {
                    if (Number(userRl.rows[index].Release_Level) === 1) {
                        for (let i in notification.ioObject.listUSer) {
                            if (notification.ioObject.listUSer[i].userId.toUpperCase() === userRl.rows[index].userId.toUpperCase()) {
                                notification.ioObject.socketIo.to(notification.ioObject.listUSer[i].id).emit("sendDataServer", { 
                                    Content:null,
                                    createAt:today,
                                    changeAt:today,
                                    forUserId:userRl.rows[index].userId.toUpperCase(),
                                    FromUserId:userId,
                                    NotiType:3,
                                    NotiTypeDescription:'Requires approval PR ',
                                    PR_NO:resultSap.HEADER.PR_NO,
                                    StatusCode:'',
                                    StatusDescription:'pending'});
                            }
                        }
                        const options = {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `key=AAAAkYIgOkw:APA91bG85im61pDjrYE3EIcT_6110BNlgwG3mL07gFw7C2KuyIeUjnQoYQx2R1PDk58XcUkQtBShUWTrO4un49QzCG6rv2udO2FTTQ4hsW1ZVN7J81BJVqhBzJ_pkwc2jGwcuHV5ef2p`
                            }
                          };
                        for(let n in dataPushNotificationMobile.rows){
                            if(dataPushNotificationMobile.rows[n].userId === userRl.rows[index].userId.toUpperCase()){
                                const data = {
                                    "registration_ids": [`${dataPushNotificationMobile.rows[n].Token}`],
                                    "notification": {
                                        "body": `${userId}: Requires approval PR  - ${resultSap.HEADER.PR_NO}`,
                                        "PR_NO": resultSap.HEADER.PR_NO,
                                        "OrganizationId": "2",
                                        "content_available": true,
                                        "priority": "high",
                                        "subtitle": "Elementary School",
                                        "title": "PR",
                                        "date": today
                                    },
                                    "data": {
                                        "priority": "high",
                                        "sound": "app_sound.wav",
                                        "content_available": true,
                                        "bodyText": resultSap.HEADER.PR_NO,
                                        "organization": "Elementary school"
                                    }
                                }; 
                                // options.headers.Authorization = `key=${dataPushNotificationMobile.rows[n].Token}`;
                                await axios.post('https://fcm.googleapis.com/fcm/send?', data, options)
                                .then(function (response) {
                                    // handle success
                                    // console.log(response);
                                })
                                .catch(function (error) {
                                    // handle error
                                    // console.log(error);
                                })
                                .then(function () {
                                    // always executed
                                });
                            }
                        }

                        //string for insert table notification
                        var stringValueChidenNoti = '';
                        if (checkInsertNotification === 1) {
                            stringValueChidenNoti = `('${userRl.rows[index].userId.toUpperCase()}','${userId}','${resultSap.HEADER.PR_NO}', '', 'pending', 'now()', 'now()', 'Approve Request', 3)`;
                        } else {
                            stringValueChidenNoti = `,('${userRl.rows[index].userId.toUpperCase()}','${userId}','${resultSap.HEADER.PR_NO}', '', 'pending', 'now()', 'now()', 'Approve Request', 3)`;
                        }
                        stringValueNoti += stringValueChidenNoti;
                        checkInsertNotification += 1;


                    }
                } catch (error) {
                    console.log(error)
                }



                var stringValueChidden = '';
                stringValueChidden = `(${resultSap.HEADER.PR_NO},'${userRl.rows[index].userId.toUpperCase()}','${userRl.rows[index].Release_Level}')`;
                if (lengX > Number(index) + 1) {
                    stringValueChidden += ','
                }
                query_PR_RL_STRA += stringValueChidden;
            }
            if (checkInsertNotification > 1) {
                //insert to table notification
                await db.query(`${stringValueNoti}`);
            }
            await db.query(`${query_PR_RL_STRA};`);
            // }  
            //update PR Item
            return ({code:200,data:resultSap});
        }
        // resolve(data);
    } catch (error) {
        return (error);
    }
}
module.exports = {
    updateTablePrAndRelease: updateTablePrAndRelease,
}
