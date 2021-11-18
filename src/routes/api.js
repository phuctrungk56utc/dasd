/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/routes/api.js
 */
const express = require("express");
var cors = require('cors');
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controllers/AuthController");
const FriendController = require("../controllers/FriendController");
const AuthLoginMiddleware = require("../middleware/AuthLoginMiddleware");
const AuthRefreshMiddleware = require("../middleware/AuthRefreshMiddleware");
const isPrData = require("../middleware/PrMiddleware");

const AuthLogin = require("../controllers/AuthLogin");
const hiddenItem = require("../controllers/hiddenItem");
const PrType = require("../controllers/PrType");
const PrTable = require("../controllers/PrTable");
const PrTablePrApprove = require("../controllers/PrTablePrApprove");
const PrItem = require("../controllers/PrItem");
const updateHiddenItem = require("../controllers/updateHiddenItem");
//master data
const getAllMasterData = require("../controllers/masterdata/getAllMasterData");
const postMasterData = require("../controllers/masterdata/postMasterData");

const getCompanyCode = require("../controllers/masterdata/getCompanyCode");
const postCompanyCode = require("../controllers/masterdata/postCompanyCode");
const Plant = require("../controllers/masterdata/getPlant");
const postPlant = require("../controllers/masterdata/postPlant");
const PurchasingGroup = require("../controllers/masterdata/getPurchasingGroup");
const postPurchasingGroup = require("../controllers/masterdata/postPurchasingGroup");
const PurchasingOrg = require("../controllers/masterdata/getPurchasingOrg");
const postPurchasingOrg = require("../controllers/masterdata/postPurchasingOrg");
//module Release
const moduleTable = require("../controllers/moduleRelease/moduleTable");
const postModuleRelease = require("../controllers/moduleRelease/postModuleRelease");
const releaseConfigList = require("../controllers/moduleRelease/releaseConfigList");
const postReleaseConfigList = require("../controllers/moduleRelease/postReleaseConfigList");
const listReleaseCondition = require("../controllers/moduleRelease/getListReleaseCondition");
const releaseCondition = require("../controllers/moduleRelease/releaseCondition");
const postReleaseCondition = require("../controllers/moduleRelease/postReleaseCondition");
//configuration 
const strategy = require("../controllers/moduleRelease/strategy");
//get ApproveDetail
const getApproveDetail = require("../controllers/PR/getApproveDetail");
//approvePR
const approvePr = require("../controllers/PR/approvePr");
//rejectPr
const rejectPr = require("../controllers/PR/rejectPr");
//getPricePrItem
const getPricePrItem = require("../controllers/PR/getPricePrItem/getPricePrItem");
//saveDraft and saveSubmit (save PR to BA)
const saveDraft = require("../controllers/PR/saveDraft");
const saveAndSubmit = require("../controllers/PR/saveAndSubmit");
//Update Pr Submit
const updatePrSubmit = require("../controllers/PR/updatePrSubmit");
//delete Pr
const deletePr = require("../controllers/PR/deletePr");
//upload File
const uploadFiles = require("../controllers/PR/files/uploadFiles");
//get list file upload
const getListFile = require("../controllers/PR/files/getListFile");
//get getNotification
const getNotification = require("../controllers/notification/getNotification");
//get listRelease
const getListRelease = require("../controllers/moduleRelease/getListRelease");
//post postStrategy
const postStrategy = require("../controllers/moduleRelease/postStrategy");
//get getUser
const getUser = require("../controllers/userManage/getAllUser");
//get role
const getRole = require("../controllers/role/getRole");
//post role
const postRole = require("../controllers/role/postRole");

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initAPIs = (app) => {
  router.use(cors());
  router.post("/login", AuthController.login);
  router.post("/authLogin",AuthLoginMiddleware, AuthLogin.authLogin);
  router.post("/refresh-token", AuthController.refreshToken);
  router.post("/auThRefresh",AuthRefreshMiddleware, AuthLogin.auThRefresh);


  router.get("/hiddenItem", hiddenItem.hiddenItem);
  router.get("/PrType", PrType.PrType);
  // router.get("/PrTable", PrTable.PrTable);
  // Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(isPrData.isPrData);
  
  router.get("/PrTablePrApprove", PrTablePrApprove.PrTablePrApprove);
  router.get("/PrTable", PrTable.PrTable);
  router.get("/PrItem", PrItem.PrItem);
  router.post("/updateHiddenItem", updateHiddenItem.updateHiddenItem);
  //module Release
  router.get("/moduleTable", moduleTable.moduleTable);
  router.post("/moduleTable", postModuleRelease.postModuleRelease);
  router.get("/releaseConfigList", releaseConfigList.releaseConfigList);
  router.post("/releaseConfigList", postReleaseConfigList.postReleaseConfigList);
  router.get("/listReleaseCondition", listReleaseCondition.listReleaseCondition);
  router.get("/releaseCondition", releaseCondition.releaseCondition);
  router.post("/releaseCondition", postReleaseCondition.postReleaseCondition);

  router.get("/strategy", strategy.strategy);
  //getPricePrItem
  router.get("/getPricePrItem", getPricePrItem.getPricePrItem);
  //saveDraft and saveSubmit (save PR to BA)
  router.post("/saveDraft", saveDraft.saveDraft);
  router.post("/saveAndSubmit", saveAndSubmit.saveAndSubmit);
  //Update Pr Submit
  router.post("/updatePrSubmit", updatePrSubmit.updatePrSubmit);
  //master data
  router.get("/getMasterData", getAllMasterData.getAllMasterData);
  router.post("/postMasterData", postMasterData.postMasterData);

  router.get("/companyCode", getCompanyCode.companyCode);
  router.post("/CompanyCode", postCompanyCode.postCompanyCode);
  router.get("/Plant", Plant.Plant);
  router.post("/Plant", postPlant.Plant);
  router.get("/PurchasingGroup", PurchasingGroup.PurchasingGroup);
  router.post("/PurchasingGroup", postPurchasingGroup.postPurchasingGroup);
  router.get("/PurchasingOrg", PurchasingOrg.PurchasingOrg);
  router.post("/PurchasingOrg", postPurchasingOrg.postPurchasingOrg);

  //dm đây là Approve detail
  router.get("/ApproveDetail", getApproveDetail.getApproveDetail);
  //dm đây là  List Protect APIs:
  router.get("/friends", FriendController.friendLists);
  // router.get("/example-protect-api", ExampleController.someAction);
  //dm đây là approvePr
  router.post("/approvePr", approvePr.approvePr);
  //dm đây là rejectPr
  router.post("/rejectPr", rejectPr.rejectPr);
  //dm đây là delete PR
  router.post("/deletePr", deletePr.deletePr);
  //dm đây là upload File
  router.post("/uploadFiles",uploadFiles.upload.array('myFile', 10) ,uploadFiles.uploadFiles);
  //dm đây là  get list file upload
  router.get("/getListFile" ,getListFile.getListFile);
  //dm đây là download file
  router.get("/downloadFile" ,uploadFiles.downloadFile);
  //dm đây là  get getNotification
  router.get("/getNotification" ,getNotification.getNotification);
  //dm đây là get list Release
  router.get("/getListRelease" ,getListRelease.getListRelease);
  //dm đây là post postStrategy
  router.post("/postStrategy" ,postStrategy.postStrategy);
  //dm đây là get user
  router.get("/getUsers" ,getUser.getUser);
  //get role
  router.get("/getRole" ,getRole.getRole);
  //post role
  router.post("/postRole" ,postRole.postRole);
  return app.use("/", router);
}
// module.exports = {
//   initAPIs: initAPIs,
//   pools:pools,
// };
module.exports = initAPIs;
