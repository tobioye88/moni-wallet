import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

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
export class User implements IUser {
  @Prop({ required: true, trim: true })
  first_name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true, unique: true })
  phone_number: string;

  @Prop({ required: true })
  dob: Date;
}

export type UserDocument = User & Document;

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({
  email: 'text',
  phone: 'text',
});

export { UserSchema };
