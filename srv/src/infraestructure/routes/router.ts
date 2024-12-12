import express from "express";
import applicationRouter from "./application.route";
import hanaOnPremiseRouter from "./hanaOnPremise.route";

const router = express.Router()

router.use("/applications", applicationRouter)
router.use("/service-test", hanaOnPremiseRouter)

export default router