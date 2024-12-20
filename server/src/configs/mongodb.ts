import { connect, ConnectOptions, mongo } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
let bucket :any
export const dbConnect = async() => {
    const db = await connect(process.env.MONGODB_URL!, {} as ConnectOptions)
    console.log('success connect to mongodb')
    bucket = new mongo.GridFSBucket(db.connection.getClient().db(), { bucketName: 'uploads' });
    return 
}
export default bucket