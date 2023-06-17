import { UserModelType } from 'app/model/user';
import 'egg';
import { Connection, Model } from 'mongoose';
import { Interface } from 'readline';

declare module 'egg' {
    // app 自定义类型
    interface Application{
        mongoose: Connection;
        model: MongooseModel;
    }
    // mongooseModel
    interface MongooseModels extends IModel{
        [key: string]: Model<any>
    }
    interface Context {
        genHash(plainText: string): Promise<string>;
        compare(plainText: string, hash: string): Promise<string>;
    }
    interface EggAppConfig {
        bcrypt: {
            saltRounds: number
        }
    }

}