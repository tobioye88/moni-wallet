import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { IUser } from '../../users/interfaces/user.interface';
import { IWallet } from '../interfaces/wallet.interface';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Wallet implements IWallet {
  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  previous_balance: number;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  user: IUser;
}

export type WalletDocument = Wallet & Document;

const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({
  user: 'text',
});

export { WalletSchema };
