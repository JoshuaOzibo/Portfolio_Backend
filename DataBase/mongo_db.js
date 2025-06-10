import mongoose from "mongoose";


const connectDb = async() => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true, //This tells Mongoose to use the new MongoDB connection string parser. this means incase theres any changes in the string it should use the newly created one;
      useUnifiedTopology: true, // this tells Mongoose to use the new MongoDB driver's unified topology engine.
        })
        console.log('Mongodb connected successfully')
    } catch (error) {
        console.log(`error connecting to mangodb ${error}`)
        
    }
};

export default connectDb;