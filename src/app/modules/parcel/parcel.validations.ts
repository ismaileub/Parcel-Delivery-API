import { z } from "zod";
import { Types } from "mongoose";

// Mongoose ObjectId regex validator (basic)
const objectIdSchema = z.custom<Types.ObjectId>((val) =>
  Types.ObjectId.isValid(String(val))
);

// Enum for status
export const parcelStatusEnum = z
  .enum([
    "Pending",
    "Approved",
    "Picked Up",
    "Dispatched",
    "In-Transit",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ])
  .optional();
export const parcelStatusLogsSchema = z.object({
  status: parcelStatusEnum,
  updateAt: z.date().optional(),
  updatedBy: objectIdSchema,
  location: z.string().min(1).optional(),
  note: z.string().optional(),
});

export const createParcelZodSchema = z.object({
  sender: objectIdSchema,
  receiver: objectIdSchema,
  type: z.string().min(1),
  weight: z.number().positive(),
  fee: z.number().nonnegative(),
  newDate: z.date().optional(),
  pickupAddress: z.string().min(1),
  deliveryAddress: z.string().min(1),

  currentStatus: parcelStatusEnum,
  statusLogs: z.array(parcelStatusLogsSchema).optional(), // can start empty or prefilled
});

export const updateParcelZodSchema = z.object({
  sender: objectIdSchema.optional(),
  receiver: objectIdSchema.optional(),
  type: z.string().min(1).optional(),
  weight: z.number().positive().optional(),
  fee: z.number().nonnegative().optional(),
  newDate: z.date().optional(),
  pickupAddress: z.string().min(1).optional(),
  deliveryAddress: z.string().min(1).optional(),
  deliveryDate: z.date().optional(),
  currentStatus: parcelStatusEnum.optional(),
  updatedBy: objectIdSchema,
  note: z.string().optional(),
  statusLogs: z.array(parcelStatusLogsSchema).optional(),
});
