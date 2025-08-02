import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("✅ Super Admin already exists!");
      return;
    }

    console.log("⏳ Creating Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN, // ✅ Match the IUser interface
      auths: [authProvider],
    };

    const superadmin = await User.create(payload);

    console.log("✅ Super Admin created successfully!\n");
    console.log(superadmin);
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
  }
};
