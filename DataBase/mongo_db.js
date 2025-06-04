import mongoose from "mongoose";


const connectDb = async() => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log('Mongodb connected successfully')
    } catch (error) {
        console.log(`error connecting to mangodb ${error}`)
        
    }
};

export default connectDb;