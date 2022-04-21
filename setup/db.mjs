import mongoose from 'mongoose';
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

export default mongoose;


