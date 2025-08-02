import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;

  console.log("Creating user with data:", { email, role, rest });

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  if (payload.role === Role.ADMIN || payload.role === Role.SUPER_ADMIN) {
    throw new AppError(
      403,
      "Only Super Admin can assign 'ADMIN' or 'SUPER_ADMIN' roles."
    );
  }

  // Default role if not provided
  if (!payload.role) {
    payload.role = Role.SENDER;
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    role: role || Role.SENDER,
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isSelfUpdate = decodedToken._id === userId;
  const isAdmin = decodedToken.role === Role.ADMIN;

  // Disallow email update
  if (payload.email && payload.email !== existingUser.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Email cannot be updated");
  }

  // Restrict role updates
  if (payload.role && payload.role !== existingUser.role) {
    if (!isAdmin) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change user role"
      );
    }
  }

  // Restrict who can update who
  if (!isSelfUpdate && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own profile"
    );
  }

  // If password is being updated, hash it
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
