import mongoose from 'mongoose';

export default async function connectMongoDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Dtabase connected ✅');
    } catch (error) {
        console.log('error connecting to mongodb',error.message);
    }
}