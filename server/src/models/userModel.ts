import mongoose, { Model } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcryptjs";

// Define the User interface (for individual documents)
interface IUser extends Document {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  role: string | null;
  createdAt?: Date;
}

// Define the User model interface (to include custom static methods)
interface IUserModel extends Model<IUser> {
  login(userNameEmail: string, password: string): Promise<IUser>;
  comparePassword(enteredPassword: string): Promise<IUser>;

}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    userName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "MANAGER"],
      default: "CUSTOMER",
      required: true,
    },
  },
  { timestamps: true }
);

//encrypt password before save
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash.
userSchema.methods.comparePassword = async function (
  enteredPassword:any
) {
  return bcrypt.compare(enteredPassword, this.password);
};

//create a custom login method on the model to decrypt the password
userSchema.statics.login = async function (
  userNameEmail: string,
  password: string
): Promise<IUser> {
  let user;
  const isUserEmail = isEmail(userNameEmail);

  if (isUserEmail) {
    const email = userNameEmail;
    user = await this.findOne({ email });
  } else {
    const userName = userNameEmail;
    user = await this.findOne({ userName });
  }

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("This account does not exist");
  }
};

export const userModel =
  (mongoose.models.user as unknown as IUserModel) ||
  mongoose.model<IUser, IUserModel>("user", userSchema);
