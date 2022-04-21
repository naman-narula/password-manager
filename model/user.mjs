import mongoose from '../setup/db.mjs';
import bcrypt from 'bcrypt';
import Crypto from '../Utils/encrypt.mjs';

const passwordSchema = new mongoose.Schema({
    appName: String,
    appPassword: String
});
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apps: [passwordSchema]
});

userSchema.index({ name: 1, unique: true });

const User = mongoose.model('user', userSchema);
export { User };
const UserModel = {};

UserModel.saveUser = async (email, password) => {
    try {
        const newUser = new User({ email, password, apps: [] });
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;
        const result = await newUser.save();
        if (result === newUser) {
            return {success:true,message:''};
        }
        return result.errors.message;
    } catch (err) {
        console.error(err);
        return {success:false,message:err.message}
    }
};

UserModel.authenticateUser = async (email, password) => {
    try {
        const user = await User.findOne({ email: email }).exec();
        let authenticated;
        if (user) {
            authenticated = await bcrypt.compare(password, user.password);
        } else {
            return {user:null,authenticated:false};
        }
        if (authenticated) {
            return {user,authenticated:true};
        }
        return {user:null,authenticated:false};
    } catch (error) {
        console.debug('Usermodel.authencticatedUser', error);
        throw error;
    }
};

UserModel.addApp = async (appName, appPassword, email) => {
    try {
        const user = await User.findOne({ email: email });
        const appEncryptedPassword = Crypto.encrypt(appPassword, user.password);
        const result = await User.updateOne(
            { email: email },
            {
                $push: {
                    apps: { appName, appPassword: appEncryptedPassword }
                }
            }
        );
        console.log(result.nModified);
    } catch (error) {
        console.error(error);
    }
};

UserModel.findUser = async (email) =>{
    return await User.findOne({email});
}
export default UserModel;
