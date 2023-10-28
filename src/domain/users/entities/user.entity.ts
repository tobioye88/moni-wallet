import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';

@Schema()
export class User implements IUser {
  @Prop({ required: true, trim: true })
  first_name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone_number: string;

  @Prop({ required: true, trim: true })
  dob: Date;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({
  email: 'text',
});

export { UserSchema };
