import { Types } from "mongoose";

export type parcelStatus =
  | "Pending"
  | "Approved"
  | "Picked Up"
  | "Dispatched"
  | "In-Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export interface ParcelStatusLogs {
  status: parcelStatus;
  updateAt?: Date;
  updatedBy: Types.ObjectId;
  location: string;
  note?: string;
}

export interface IParcel {
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: string;
  weight: number;
  fee: number;
  newDate?: Date;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryDate: Date;
  currentStatus: parcelStatus;
  statusLogs: ParcelStatusLogs[];
}
