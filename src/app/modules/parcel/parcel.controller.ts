import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { parcelService } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const payload = req.body;
  const parcel = await parcelService.createParcel(payload, decodedToken.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    data: parcel,
  });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const { currentStatus, updatedBy, note } = req.body;
  const updatedParcel = await parcelService.updateParcelStatus(
    parcelId,
    currentStatus,
    updatedBy,
    note
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Parcel status updated to "${currentStatus}" successfully`,
    data: updatedParcel,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const senderId = (req.user as JwtPayload).userId;
  const { parcelId } = req.params;
  const result = await parcelService.cancelParcel(parcelId, senderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel cancelled successfully",
    data: result,
  });
});

const blockParcel = catchAsync(async (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const result = await parcelService.blockParcel(parcelId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel blocked successfully",
    data: result,
  });
});

const rescheduleParcel = catchAsync(async (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const result = await parcelService.rescheduleParcel(parcelId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel rescheduled successfully",
    data: result,
  });
});

const returnParcel = catchAsync(async (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const result = await parcelService.returnParcel(parcelId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel returned successfully",
    data: result,
  });
});

const deleteParcel = catchAsync(async (req: Request, res: Response) => {
  const senderId = (req.user as JwtPayload).userId;
  const { parcelId } = req.params;
  const result = await parcelService.deleteParcel(parcelId, senderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel deleted successfully",
    data: result,
  });
});

const trackParcel = catchAsync(async (req: Request, res: Response) => {
  const { trackingId } = req.params;
  const result = await parcelService.trackParcel(trackingId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tracking info retrieved",
    data: result,
  });
});

const getSenderParcels = catchAsync(async (req: Request, res: Response) => {
  const senderId = (req.user as JwtPayload).userId;
  const result = await parcelService.getParcelsBySender(senderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sender parcels fetched successfully",
    data: result,
  });
});

const getReceiverParcels = catchAsync(async (req: Request, res: Response) => {
  const receiverId = (req.user as JwtPayload).userId;
  const result = await parcelService.getParcelsByReceiver(receiverId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Receiver parcels fetched successfully",
    data: result,
  });
});

const getAllParcels = catchAsync(async (req: Request, res: Response) => {
  const result = await parcelService.getAllParcels(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All parcels fetched successfully",
    data: result,
  });
});

const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload).userId;
  const role = (req.user as JwtPayload).role;
  const { parcelId } = req.params;
  const result = await parcelService.getParcelById(parcelId, userId, role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel fetched successfully",
    data: result,
  });
});

export const parcelController = {
  createParcel,
  updateParcelStatus,
  cancelParcel,
  blockParcel,
  rescheduleParcel,
  returnParcel,
  deleteParcel,
  trackParcel,
  getSenderParcels,
  getReceiverParcels,
  getAllParcels,
  getSingleParcel,
};
