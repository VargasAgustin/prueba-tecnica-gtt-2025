import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  age: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  profileId: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
