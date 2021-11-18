"use strict";

/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/routes/api.js
 */
var express = require("express");

var cors = require('cors');

var router = express.Router();

var AuthMiddleWare = require("../middleware/AuthMiddleware");

var AuthController = require("../controllers/AuthController");

var FriendController = require("../controllers/FriendController");

var AuthLoginMiddleware = require("../middleware/AuthLoginMiddleware");

var AuthRefreshMiddleware = require("../middleware/AuthRefreshMiddleware");

var isPrData = require("../middleware/PrMiddleware");

var AuthLogin = require("../controllers/AuthLogin");

var hiddenItem = require("../controllers/hiddenItem");

var PrType = require("../controllers/PrType");

var PrTable = require("../controllers/PrTable");

var PrTablePrApprove = require("../controllers/PrTablePrApprove");

var PrItem = require("../controllers/PrItem");

var updateHiddenItem = require("../controllers/updateHiddenItem"); //master data


var getAllMasterData = require("../controllers/masterdata/getAllMasterData");

var postMasterData = require("../controllers/masterdata/postMasterData");

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


var deletePr = require("../controllers/PR/deletePr"); //upload File


var uploadFiles = require("../controllers/PR/files/uploadFiles"); //get list file upload


var getListFile = require("../controllers/PR/files/getListFile"); //get getNotification


var getNotification = require("../controllers/notification/getNotification"); //get listRelease


var getListRelease = require("../controllers/moduleRelease/getListRelease"); //post postStrategy


var postStrategy = require("../controllers/moduleRelease/postStrategy"); //get getUser


var getUser = require("../controllers/userManage/getAllUser"); //get role


var getRole = require("../controllers/role/getRole"); //post role


var postRole = require("../controllers/role/postRole");
/**
 * Init all APIs on your application
 * @param {*} app from express
 */


var initAPIs = function initAPIs(app) {
  router.use(cors());
  router.post("/login", AuthController.login);
  router.post("/authLogin", AuthLoginMiddleware, AuthLogin.authLogin);
  router.post("/refresh-token", AuthController.refreshToken);
  router.post("/auThRefresh", AuthRefreshMiddleware, AuthLogin.auThRefresh);
  router.get("/hiddenItem", hiddenItem.hiddenItem);
  router.get("/PrType", PrType.PrType); // router.get("/PrTable", PrTable.PrTable);
  // Sử dụng authMiddleware.isAuth trước những api cần xác thực

  router.use(isPrData.isPrData);
  router.get("/PrTablePrApprove", PrTablePrApprove.PrTablePrApprove);
  router.get("/PrTable", PrTable.PrTable);
  router.get("/PrItem", PrItem.PrItem);
  router.post("/updateHiddenItem", updateHiddenItem.updateHiddenItem); //module Release

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
  router.get("/companyCode", getCompanyCode.companyCode);
  router.post("/CompanyCode", postCompanyCode.postCompanyCode);
  router.get("/Plant", Plant.Plant);
  router.post("/Plant", postPlant.Plant);
  router.get("/PurchasingGroup", PurchasingGroup.PurchasingGroup);
  router.post("/PurchasingGroup", postPurchasingGroup.postPurchasingGroup);
  router.get("/PurchasingOrg", PurchasingOrg.PurchasingOrg);
  router.post("/PurchasingOrg", postPurchasingOrg.postPurchasingOrg); //dm đây là Approve detail

  router.get("/ApproveDetail", getApproveDetail.getApproveDetail); //dm đây là  List Protect APIs:

  router.get("/friends", FriendController.friendLists); // router.get("/example-protect-api", ExampleController.someAction);
  //dm đây là approvePr

  router.post("/approvePr", approvePr.approvePr); //dm đây là rejectPr

  router.post("/rejectPr", rejectPr.rejectPr); //dm đây là delete PR

  router.post("/deletePr", deletePr.deletePr); //dm đây là upload File

  router.post("/uploadFiles", uploadFiles.upload.array('myFile', 10), uploadFiles.uploadFiles); //dm đây là  get list file upload

  router.get("/getListFile", getListFile.getListFile); //dm đây là download file

  router.get("/downloadFile", uploadFiles.downloadFile); //dm đây là  get getNotification

  router.get("/getNotification", getNotification.getNotification); //dm đây là get list Release

  router.get("/getListRelease", getListRelease.getListRelease); //dm đây là post postStrategy

  router.post("/postStrategy", postStrategy.postStrategy); //dm đây là get user

  router.get("/getUsers", getUser.getUser); //get role

  router.get("/getRole", getRole.getRole); //post role

  router.post("/postRole", postRole.postRole);
  return app.use("/", router);
}; // module.exports = {
//   initAPIs: initAPIs,
//   pools:pools,
// };


module.exports = initAPIs;