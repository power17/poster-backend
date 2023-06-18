import { Application } from 'egg';
import { Schema } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

export interface UserModelType {
  type: 'email'| 'phone';
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  picture?: string;
  phoneNumber?: string;
  createAt:Date;
  updateAt: Date;

}
function initUserModel(app:Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const UserSchema = new Schema<UserModelType>({
    type: { type: String, default: 'email' },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String },
    nickname: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
  }, {
    timestamps: { currentTime: () => new Date(), createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: {
      transform(_doc, _ret) {
        delete _ret.password;
        delete _ret.__v;
      },
    },
  });
  UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'user-id' });
  return app.mongoose.model<UserModelType>('User', UserSchema);
}
export default initUserModel;
