import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { accountController } from "./controllers/account-controller.js";

export const router = express.Router();

router.get("/", accountController.index);
router.get("/login", accountController.login);
router.get("/signup", accountController.signup);
router.get("/logout", accountController.logout);
router.post("/register", accountController.register);
router.post("/authenticate", accountController.authenticate);
router.get("/users", accountController.listUsers);
router.post("/account/updateUser/:userid", accountController.updateUser);
router.get("/account/:userid", accountController.showUser);
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/dashboard/deletestation/:id", dashboardController.deleteStation);
router.get("/about", aboutController.index);
router.get("/station/:id", stationController.index);
router.post("/station/:id/addreading", stationController.addReading);
router.get("/station/:stationid/deletereading/:readingid", stationController.deleteReading);

