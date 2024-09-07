import mongoose from 'mongoose';

export default () => {
    mongoose.connect("mongodb+srv://indravijaysinh50:zala@serverlessinstance0.fsmv2a5.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log("Error connecting to database", e);
    });
};
