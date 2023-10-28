import { Types } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';

export interface IWallet {
  _id?: Types.ObjectId;
  id?: string;
  balance: number;
  previous_balance: number;
  user: IUser | string;
  created_at?: Date;
  updated_at?: Date;
}
