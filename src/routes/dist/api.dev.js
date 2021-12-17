"use strict";

/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/routes/api.js
 */
var express = require("express");

var cors = require('cors');

var router = express.Router();

var AuthMiddleWare = require("../middleware/AuthMiddleware");

var AuthController = require("../controllers/AuthController"); // const FriendController = require("../controllers/FriendController");


var AuthLoginMiddleware = require("../middleware/AuthLoginMiddleware");

var AuthRefreshMiddleware = require("../middleware/AuthRefreshMiddleware");

var isPrData = require("../middleware/PrMiddleware");

var AuthLogin = require("../controllers/AuthLogin");

var hiddenItem = require("../controllers/hiddenItem");

var PrType = require("../controllers/PrType");

var PostPrType = require("../controllers/PostPrType");

var PrTable = require("../controllers/PrTable");

var PrTablePrApprove = require("../controllers/PrTablePrApprove");

var PrItem = require("../controllers/PrItem");

var updateHiddenItem = require("../controllers/updateHiddenItem"); //master data


var getAllMasterData = require("../controllers/masterdata/getAllMasterData");

var postMasterData = require("../controllers/masterdata/postMasterData");

var postMaterial = require("../controllers/masterdata/postMaterial");

var getCompanyCode = require("../controllers/masterdata/getCompanyCode");

var postCompanyCode = require("../controllers/masterdata/postCompanyCode");

var Plant = require("../controllers/masterdata/getPlant");

var postPlant = require("../controllers/masterdata/postPlant");

var PurchasingGroup = require("../controllers/masterdata/getPurchasingGroup");

var postPurchasingGroup = require("../controllers/masterdata/postPurchasingGroup");

var PurchasingOrg = require("../controllers/masterdata/getPurchasingOrg");

var postPurchasingOrg = require("../controllers/masterdata/postPurchasingOrg"); //module Release


var moduleTable = require("../controllers/moduleRelease/moduleTable");

var postModuleRelease = require("../controllers/moduleRelease/postModuleRelease");

var releaseConfigList = require("../controllers/moduleRelease/releaseConfigList");

var postReleaseConfigList = require("../controllers/moduleRelease/postReleaseConfigList");

var listReleaseCondition = require("../controllers/moduleRelease/getListReleaseCondition");

var releaseCondition = require("../controllers/moduleRelease/releaseCondition");

var postReleaseCondition = require("../controllers/moduleRelease/postReleaseCondition"); //configuration 


var strategy = require("../controllers/moduleRelease/strategy"); //get ApproveDetail


var getApproveDetail = require("../controllers/PR/getApproveDetail"); //approvePR


var approvePr = require("../controllers/PR/approvePr"); //rejectPr


var rejectPr = require("../controllers/PR/rejectPr"); //getPricePrItem


var getPricePrItem = require("../controllers/PR/getPricePrItem/getPricePrItem"); //saveDraft and saveSubmit (save PR to BA)


var saveDraft = require("../controllers/PR/saveDraft");

var saveAndSubmit = require("../controllers/PR/saveAndSubmit"); //Update Pr Submit


var updatePrSubmit = require("../controllers/PR/updatePrSubmit"); //delete Pr


var deletePr = require("../controllers/PR/deletePr"); //copyPr


var copyPr = require("../controllers/PR/copyPr"); //upload File


var uploadFiles = require("../controllers/PR/files/uploadFiles"); //get list file upload


var getListFile = require("../controllers/PR/files/getListFile"); //get getNotification


var getNotification = require("../controllers/notification/getNotification"); //updateStatus notification


var updateStatus = require("../controllers/notification/updateStatus"); //postNotificationMobile


var postNotificationMobile = require("../controllers/notification/postNotificationMobile"); //get listRelease


var getListRelease = require("../controllers/moduleRelease/getListRelease"); //post postStrategy


var postStrategy = require("../controllers/moduleRelease/postStrategy"); //get getUser


var getUser = require("../controllers/userManage/getAllUser"); //createUsers


var createUsers = require("../controllers/userManage/createUsers"); //get role


var getRole = require("../controllers/role/getRole"); //getUserRole


var getUserRole = require("../controllers/role/getUserRole"); //post role


var postRole = require("../controllers/role/postRole"); //postUserRole


var postUserRole = require("../controllers/role/postUserRole"); //getUserRoleAuthorization


var getUserRoleAuthorization = require("../controllers/role/getUserRoleAuthorization"); // getUserCompany


var getUserCompany = require("../controllers/userCompany/getUserCompany"); //postUserCompany


var postUserCompany = require("../controllers/userCompany/postUserCompany"); //get getUserInfo


var getUserInfo = require("../controllers/userInfo/getUserInfo"); //get getUserInfo


var postUserInfo = require("../controllers/userInfo/postUserInfo"); //get postUserInfo


var changePass = require("../controllers/userInfo/changePass");
/**
 * Init all APIs on your application
 * @param {*} app from express
 */


var initAPIs = function initAPIs(app) {
  router.use(cors());
  router.post("/login", AuthController.login);
  router.post("/authLogin", AuthLoginMiddleware, AuthLogin.authLogin);
  router.post("/refresh-token", AuthController.refreshToken);
  router.post("/auThRefresh", AuthRefreshMiddleware, AuthLogin.auThRefresh); // router.get("/PrTable", PrTable.PrTable);
  // Sử dụng authMiddleware.isAuth trước những api cần xác thực

  router.use(isPrData.isPrData); //Configuration

  router.get("/hiddenItem", hiddenItem.hiddenItem);
  router.get("/PrType", PrType.PrType);
  router.post("/PostPrType", PostPrType.PostPrType);
  router.post("/updateHiddenItem", updateHiddenItem.updateHiddenItem); //PR

  router.get("/PrTablePrApprove", PrTablePrApprove.PrTablePrApprove);
  router.get("/PrTable", PrTable.PrTable);
  router.get("/PrItem", PrItem.PrItem); //dm đây là Approve detail

  router.get("/ApproveDetail", getApproveDetail.getApproveDetail); //module Release

  router.get("/moduleTable", moduleTable.moduleTable);
  router.post("/moduleTable", postModuleRelease.postModuleRelease);
  router.get("/releaseConfigList", releaseConfigList.releaseConfigList);
  router.post("/releaseConfigList", postReleaseConfigList.postReleaseConfigList);
  router.get("/listReleaseCondition", listReleaseCondition.listReleaseCondition);
  router.get("/releaseCondition", releaseCondition.releaseCondition);
  router.post("/releaseCondition", postReleaseCondition.postReleaseCondition);
  router.get("/strategy", strategy.strategy); //getPricePrItem

  router.get("/getPricePrItem", getPricePrItem.getPricePrItem); //saveDraft and saveSubmit (save PR to BA)

  router.post("/saveDraft", saveDraft.saveDraft);
  router.post("/saveAndSubmit", saveAndSubmit.saveAndSubmit); //Update Pr Submit

  router.post("/updatePrSubmit", updatePrSubmit.updatePrSubmit); //master data

  router.get("/getMasterData", getAllMasterData.getAllMasterData);
  router.post("/postMasterData", postMasterData.postMasterData);
  router.post("/postMaterial", postMaterial.postMaterial);
  router.get("/companyCode", getCompanyCode.companyCode);
  router.post("/CompanyCode", postCompanyCode.postCompanyCode);
  router.get("/Plant", Plant.Plant);
  router.post("/Plant", postPlant.Plant);
  router.get("/PurchasingGroup", PurchasingGroup.PurchasingGroup);
  router.post("/PurchasingGroup", postPurchasingGroup.postPurchasingGroup);
  router.get("/PurchasingOrg", PurchasingOrg.PurchasingOrg);
  router.post("/PurchasingOrg", postPurchasingOrg.postPurchasingOrg); //dm đây là  List Protect APIs:
  // router.get("/friends", FriendController.friendLists);
  // router.get("/example-protect-api", ExampleController.someAction);
  //dm đây là approvePr

  router.post("/approvePr", approvePr.approvePr); //dm đây là rejectPr

  router.post("/rejectPr", rejectPr.rejectPr); //dm đây là delete PR

  router.post("/deletePr", deletePr.deletePr); //dm đây là copy PR

  router.post("/copyPr", copyPr.copyPr); //dm đây là upload File

  router.post("/uploadFiles", uploadFiles.upload.array('myFile', 10), uploadFiles.uploadFiles); //dm đây là  get list file upload

  router.get("/getListFile", getListFile.getListFile); //dm đây là download file

  router.get("/downloadFile", uploadFiles.downloadFile); //dm đây là  get getNotification

  router.get("/getNotification", getNotification.getNotification); //dm đây là  update status code notification

  router.post("/updateStatus", updateStatus.updateStatus); //postNotificationMobile

  router.post("/postNotificationMobile", postNotificationMobile.postNotificationMobile); //dm đây là get list Release

  router.get("/getListRelease", getListRelease.getListRelease); //dm đây là post postStrategy

  router.post("/postStrategy", postStrategy.postStrategy); //dm đây là get user

  router.get("/getUsers", getUser.getUser); //createUsers

  router.post("/createUsers", createUsers.createUsers); //get role

  router.get("/getRole", getRole.getRole); //getUserRole

  router.get("/getUserRole", getUserRole.getUserRole); //post role

  router.post("/postRole", postRole.postRole); //postUserRole 

  router.post("/postUserRole", postUserRole.postUserRole); // getUserRoleAuthorization

  router.get("/getUserRoleAuthorization", getUserRoleAuthorization.getUserRoleAuthorization); //

  router.get("/getUserCompany", getUserCompany.getUserCompany); //

  router.post("/postUserCompany", postUserCompany.postUserCompany); //getUserInfo

  router.get("/getUserInfo", getUserInfo.getUserInfo); //postUserInfo

  router.post("/postUserInfo", postUserInfo.postUserInfo); //changePass

  router.post("/changePass", changePass.changePass);
  return app.use("/", router);
}; // module.exports = {
//   initAPIs: initAPIs,
//   pools:pools,
// };


module.exports = initAPIs;