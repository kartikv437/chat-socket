
import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_name: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    age: Number,
    gender: String,
    dob: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = models._User || model("_User", UserSchema);
export default User;
