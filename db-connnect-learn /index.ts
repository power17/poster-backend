// import { MongoClient } from 'mongodb'
// const url = 'mongodb://localhost:27017'
// const client = new MongoClient(url)
// async function run() {
//     try{
//         await client.connect()
//         const db = client.db('hello')
//         const res = await db.command({ping:1})
//         // 数据插入
//         const userCollection = db.collection('user')
//         // const insert = await userCollection.insertOne({name:'nodeInsert'})
//         // console.log(insert, 'result insert')
//         // const cursor = userCollection.find()
//         // for await(let doc of cursor) {
//         //     console.log(doc)
//         // }
//         // const result = await userCollection.find().toArray()
//         // console.log(result,'result')
//         // 查询
//         const result = await userCollection.find({age: {$gt: 40}}).toArray()
//         console.log(result)

//     }catch(e){
//         console.error(e)
//     }finally {
//         await client.close()
//     }
// }
// run()
import { connect, Schema, model, disconnect } from 'mongoose'
async function main() {
    try{
        await connect('mongodb://localhost:27017/hello')
        console.log('mongodb connect successful')
        const ProductSchema = new Schema({
            name: String,
            price: Number
        })
        const ProductModel = model('Product', ProductSchema)
        const result = await ProductModel.create({
            name: 'power',
            price: 232
        })
        const result1 = await ProductModel.create({
            name: 'power232',
            price: 232123
        })
        console.log(result, result1)

    }catch(e) {
        console.error(e)
    }finally{
        await disconnect()
    }
    
}
main()