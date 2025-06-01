import { Document } from "mongoose";

export interface IUsers {
 fid: string;   
}

export interface IMiniAppUsersDocument extends IUsers, Document {}