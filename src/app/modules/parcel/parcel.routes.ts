import express from "express";
import { parcelController } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createParcelZodSchema,
  updateParcelZodSchema,
} from "./parcel.validations";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

// Sender-only: Create Parcel
router.post(
  "/create-parcel",
  checkAuth("SENDER"),
  validateRequest(createParcelZodSchema),
  parcelController.createParcel
);

// Admin-only: Update Parcel Status
router.patch(
  "/status/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  validateRequest(updateParcelZodSchema),
  parcelController.updateParcelStatus
);

// Sender-only: Cancel a parcel (allowed only if not dispatched)
router.patch(
  "/cancel/:parcelId",
  checkAuth("SENDER"),
  parcelController.cancelParcel
);

// Admin-only: Block a parcel
router.patch(
  "/block/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.blockParcel
);

// Admin-only: Reschedule a parcel
router.patch(
  "/reschedule/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.rescheduleParcel
);

// Admin-only: Return a parcel
router.patch(
  "/return/:parcelId",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.returnParcel
);

// Sender-only: Delete parcel (only if it's still pending or cancelled)
router.delete("/:parcelId", checkAuth("SENDER"), parcelController.deleteParcel);

// Shared: Get parcel by tracking ID (public)
router.get("/track/:trackingId", parcelController.trackParcel);

// Sender: Get all parcels they sent
router.get(
  "/sender/all",
  checkAuth("SENDER"),
  parcelController.getSenderParcels
);

// Receiver: Get all parcels being delivered to them
router.get(
  "/receiver/all",
  checkAuth("RECEIVER"),
  parcelController.getReceiverParcels
);

// Admin: Get all parcels with optional filters (status, delivery time, etc.)
router.get(
  "/admin/all",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  parcelController.getAllParcels
);

// Shared: Get parcel by ID (access control inside controller)
router.get(
  "/:parcelId",
  checkAuth("SENDER", "RECEIVER", "ADMIN", "SUPER_ADMIN"),
  parcelController.getSingleParcel
);

export const parcelRoutes = router;
