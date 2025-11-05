import express from "express";
import { parcelController } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createParcelZodSchema,
  updateParcelZodSchema,
} from "./parcel.validations";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post(
  "/create-parcel",
  checkAuth("SENDER"),
  validateRequest(createParcelZodSchema),
  parcelController.createParcel
);

router.patch(
  "/update-status/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  validateRequest(updateParcelZodSchema),
  parcelController.updateParcelStatus
);

router.patch(
  "/cancel/:parcelId",
  checkAuth("SENDER"),
  parcelController.cancelParcel
);

router.patch(
  "/block/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.blockParcel
);

router.patch(
  "/reschedule/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.rescheduleParcel
);

router.patch(
  "/return/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.returnParcel
);

router.delete("/:parcelId", checkAuth("SENDER"), parcelController.deleteParcel);

router.get("/track/:trackingId", parcelController.trackParcel);

router.get(
  "/sender/all",
  checkAuth("SENDER"),
  parcelController.getSenderParcels
);

router.get(
  "/receiver/all",
  checkAuth("RECEIVER"),
  parcelController.getReceiverParcels
);

router.patch(
  "/receiver/confirm-delivery/:parcelId",
  checkAuth("RECEIVER"),
  parcelController.confirmDeliveryByReceiver
);

router.get(
  "/admin/all",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.getAllParcels
);

router.get(
  "/:parcelId",
  checkAuth("SENDER", "RECEIVER", "ADMIN", "SUPER_ADMIN"),
  parcelController.getSingleParcel
);

export const parcelRoutes = router;
