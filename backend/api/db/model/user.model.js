import mongoose from "mongoose";
import UserSchema from "../schema/user.schema.js";

const UserModel = mongoose.model("User", UserSchema);

export function insertUser(user) {
    return UserModel.create(user);
}

export function findUserByUsername(username) {
    return UserModel.findOne({ username: username }).exec();
}

export function getAllUsers() {
    return UserModel.find().exec();
}