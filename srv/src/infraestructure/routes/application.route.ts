import express from "express"
import ApplicationController from "../controllers/application.controller"

const appRouter = express.Router()
const appController = new ApplicationController()
//FMS iniio
appRouter.get("/admin/all", appController.getAllApplicationsForAdmin.bind(appController))
//FMS fin

appRouter.post("/", appController.createApplication.bind(appController))
appRouter.get("/", appController.getApplications.bind(appController))
appRouter.get("/own", appController.getOwnApplications.bind(appController))
appRouter.get("/toApprove", appController.getApplicationsToApprove.bind(appController))


appRouter.get("/:id", appController.getSingleApplication.bind(appController))
appRouter.put("/:id/approveLevel", appController.approveApplicationLevel.bind(appController))
appRouter.put("/:id/cancel", appController.cancelApplication.bind(appController))
appRouter.put("/:id/reject", appController.rejectApplication.bind(appController))
//appRouter.get("/:id/getApprovers", appController.getApprovers.bind(appController))

export default appRouter