/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { IParcel, parcelStatus } from "./parcel.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createParcel = async (data: Partial<IParcel>, creatorId: string) => {
  const { sender, receiver } = data;

  // 1️⃣ Validate sender and receiver
  const senderExists = await User.findById(sender);
  if (!senderExists) throw new AppError(404, "Sender not found");

  const receiverExists = await User.findById(receiver);
  if (!receiverExists) throw new AppError(404, "Receiver not found");

  // 2️⃣ Generate tracking ID
  const trackingId = generateTrackingId();

  // 3️⃣ Automatically set deliveryDate → 3 days after now
  const createdAt = new Date();
  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  // 4️⃣ Create parcel
  const newParcel = await Parcel.create({
    ...data,
    trackingId,
    deliveryDate,
    currentStatus: "Pending",
    statusLogs: [
      {
        status: "Pending",
        updateAt: new Date(),
        updatedBy: new Types.ObjectId(creatorId),
        location: "Sender Warehouse",
        note: "Parcel created and awaiting pickup",
      },
    ],
  });

  return newParcel;
};

const updateParcelStatus = async (
  parcelId: string,
  newStatus: parcelStatus,
  updatedBy: Types.ObjectId,
  note?: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  if (newStatus === "Approved" && !parcel.deliveryDate) {
    const baseDate = parcel.newDate || new Date();
    const deliveryDate = new Date(baseDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    parcel.deliveryDate = deliveryDate;
  }

  if (parcel.currentStatus !== newStatus) {
    parcel.currentStatus = newStatus;
    parcel.statusLogs.push({
      status: newStatus,
      updateAt: new Date(),
      updatedBy: updatedBy,
      location: "",
      note,
    });
    await parcel.save();
  }
  return parcel;
};
const confirmDeliveryByReceiver = async (
  parcelId: string,
  receiverId: Types.ObjectId
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");

  if (parcel.currentStatus === "Out for Delivery") {
    parcel.currentStatus = "Delivered";
    parcel.statusLogs.push({
      status: "Delivered",
      updateAt: new Date(),
      updatedBy: receiverId,
      location: "",
      note: "Parcel taken by receiver",
    });
    await parcel.save();
  } else {
    throw new AppError(401, "Can not update now");
  }
  return parcel;
};

///
//
//

const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");
  if (parcel.sender.toString() !== senderId)
    throw new AppError(403, "Unauthorized");
  if (
    ["Dispatched", "Delivered", "In-Transit"].includes(parcel.currentStatus)
  ) {
    throw new AppError(400, "Cannot cancel at this stage");
  }

  if (parcel.currentStatus === "Cancelled") {
    throw new AppError(400, "Already Cancelled");
  }
  parcel.currentStatus = "Cancelled";
  parcel.statusLogs.push({
    status: "Cancelled",
    updateAt: new Date(),
    updatedBy: new Types.ObjectId(senderId),
    location: "",
    note: "Cancelled by sender",
  });
  await parcel.save();
  return parcel;
};

const blockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");
  parcel.currentStatus = "Cancelled";
  parcel.statusLogs.push({
    status: "Cancelled",
    updateAt: new Date(),
    updatedBy: new Types.ObjectId(),
    location: "",
    note: "Blocked by admin",
  });
  await parcel.save();
  return parcel;
};

const rescheduleParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 3);
  parcel.deliveryDate = newDate;
  parcel.statusLogs.push({
    status: parcel.currentStatus,
    updateAt: new Date(),
    updatedBy: new Types.ObjectId(),
    location: "",
    note: "Delivery rescheduled",
  });
  await parcel.save();
  return parcel;
};

const returnParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");
  parcel.currentStatus = "Returned";
  parcel.statusLogs.push({
    status: "Returned",
    updateAt: new Date(),
    updatedBy: new Types.ObjectId(),
    location: "",
    note: "Returned by admin",
  });
  await parcel.save();
  return parcel;
};

const deleteParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");
  if (parcel.sender.toString() !== senderId)
    throw new AppError(403, "Unauthorized");
  if (!["Pending", "Cancelled"].includes(parcel.currentStatus)) {
    throw new AppError(400, "Only pending or cancelled parcels can be deleted");
  }
  await parcel.deleteOne();
  return { message: "Parcel deleted" };
};

const trackParcel = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId });
  if (!parcel) throw new AppError(404, "Tracking ID not found");
  return parcel;
};

const getParcelsBySender = async (senderId: string) => {
  return Parcel.find({ sender: senderId }).populate("receiver", "email");
};

const getParcelsByReceiver = async (receiverId: string) => {
  return Parcel.find({ receiver: receiverId }).populate("sender", "email");
};

const getAllParcels = async (filters: any) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Sorting setup
  const sortBy = filters.sortBy || "createdAt";
  const sortOrder = filters.sortOrder === "asc" ? 1 : -1;

  // Fetch parcels with pagination and sorting
  const parcels = await Parcel.find()
    .populate("receiver", "email")
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  // Count total documents
  const total = await Parcel.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: parcels,
  };
};

const getParcelById = async (
  parcelId: string,
  userId: string,
  role: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(404, "Parcel not found");
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    if (
      parcel.sender.toString() !== userId &&
      parcel.receiver.toString() !== userId
    ) {
      throw new AppError(403, "Access denied");
    }
  }
  return parcel;
};

export const parcelService = {
  createParcel,
  updateParcelStatus,
  cancelParcel,
  blockParcel,
  rescheduleParcel,
  returnParcel,
  deleteParcel,
  trackParcel,
  getParcelsBySender,
  getParcelsByReceiver,
  getAllParcels,
  getParcelById,
  confirmDeliveryByReceiver,
};
