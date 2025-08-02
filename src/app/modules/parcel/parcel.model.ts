import { model, Schema } from "mongoose";
import { IParcel, ParcelStatusLogs } from "./parcel.interface"; // your interfaces

// Enum for parcel statuses consistent with your interface
const parcelStatuses = [
  "Pending",
  "Approved",
  "Picked Up",
  "Dispatched",
  "In-Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
] as const;

// Status logs sub-schema
const statusLogSchema = new Schema<ParcelStatusLogs>(
  {
    status: {
      type: String,
      enum: parcelStatuses,
      required: true,
    },
    updateAt: {
      type: Date,
      default: () => new Date(),
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

// Main parcel schema
const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    newDate: {
      type: Date,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryDate: {
      type: Date,
      // required: true,
    },
    currentStatus: {
      type: String,
      enum: parcelStatuses,
      default: "Pending",
      required: true,
    },
    statusLogs: {
      type: [statusLogSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Parcel = model<IParcel>("Parcel", parcelSchema);
