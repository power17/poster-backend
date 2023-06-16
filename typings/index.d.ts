import 'egg';
import { Connection, Model } from 'mongoose';

declare module 'egg' {
    type MongooseModel = {
        [key: string]: Model<any>
    }
    //  自定义类型
    interface Application{
        mongoose: Connection;
        model: MongooseModel;
    }
}