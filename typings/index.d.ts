import { UserModelType } from 'app/model/user';
import 'egg';
import { Connection, Model } from 'mongoose';

declare module 'egg' {
    //  自定义类型
    interface Application{
        mongoose: Connection;
        model: MongooseModel;
    }
    interface MongooseModels extends IModel{
        [key: string]: Model<any>
    }
}