import mongoose, { Schema } from "mongoose";
import { IUsers } from "../types/user";

const userSchema = new Schema<IUsers>({
    fid: {
        type: String,
        required: true,
        unique: true
    }
})

const userModel = mongoose.model<IUsers>("User", userSchema);

export default userModel;