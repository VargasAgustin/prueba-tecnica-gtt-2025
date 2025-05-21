import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema()
export class Profile {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  profileName: string;

  @Prop({ required: false })
  code: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

}

export type ProfileDocument = Profile & Document;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
