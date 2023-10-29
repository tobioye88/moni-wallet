import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IWallet } from '../interfaces/wallet.interface';
import { Wallet } from './wallet.entity';

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
export class FundsReference {
  @Prop({ default: 0 })
  ref: string;

  @Prop({ ref: Wallet.name, type: Types.ObjectId })
  wallet: string | IWallet;

  @Prop({ required: true })
  amount: number;
}

export type FundsReferenceDocument = FundsReference & Document;

const FundsReferenceSchema = SchemaFactory.createForClass(FundsReference);
FundsReferenceSchema.index({
  ref: 'text',
});

export { FundsReferenceSchema };
