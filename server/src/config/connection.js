import mongoose from 'mongoose';
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
// Log connection status
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
export default mongoose.connection;
