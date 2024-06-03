import mongoose from "mongoose";

let conn = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    // if the database is already connected dont connect again

    if (conn) {
        console.log('Mongo already connected');
        return;
    }

    // connect to mongo
    try {
        await mongoose.connect(process.env.MONGO_URL);
        conn = true;
        console.log('Mongo connected...')
    }
    catch (error) {
        console.log(error)
    }
}

export default connectDB;