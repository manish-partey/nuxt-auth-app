import mongoose from 'mongoose'; // This imports the default export, which is the Mongoose object itself

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();
    try {
        // Access the connect method from the imported mongoose object
        await mongoose.connect(config.mongodbUri);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});