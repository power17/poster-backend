import { Application } from 'egg';
import { Schema } from 'mongoose';

// function initUserModel(app:Application) {
//   const UserSchema = new Schema({
//     name: { type: String },
//     price: { type: Number },
//   }, { collection: 'products' });
//   if (!app.mongoose.models.ProductsModel) {
//     app.mongoose.model('ProductsModel', UserSchema);
//   }
//   // app.model.User = app.mongoose.models.ProductsModel;
//   return app.mongoose.models.ProductsModel;
// }
// export default initUserModel;

export interface UserModelType {
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
  const UserSchema = new Schema<UserModelType>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    nickname: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
  }, { timestamps: true });
  return app.mongoose.model<UserModelType>('User', UserSchema);
}
export default initUserModel;
