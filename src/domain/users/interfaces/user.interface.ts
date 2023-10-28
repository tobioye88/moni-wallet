import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: Date;
  created_at?: Date;
  updated_at?: Date;
}
