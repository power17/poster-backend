import { Application } from 'egg';
import { Schema } from 'mongoose';

function initUserModel(app:Application) {
  const UserSchema = new Schema({
    name: { type: String },
    price: { type: Number },
  }, { collection: 'products' });
  if (!app.mongoose.models.ProductsModel) {
    app.mongoose.model('ProductsModel', UserSchema);
  }
  // app.model.User = app.mongoose.models.ProductsModel;
  return app.mongoose.models.ProductsModel;
}
export default initUserModel;
