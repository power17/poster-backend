import 'egg';
import { Connection } from 'mongoose';

declare module 'egg' {
    //  自定义类型
    interface Application{
        mongoose: Connection
    }
}