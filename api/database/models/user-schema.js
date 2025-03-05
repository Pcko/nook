import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import Project from './project-schema.js';
import RefreshToken from './refreshToken-schema.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
},
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    };

    this.password = await bcrypt.hash(this.password, 10);

    next();
})

UserSchema.pre('findOneAndDelete', async function (next){
    const user = await this.model.findOne(this.getFilter());
    if (!user) return next();

    await Project.deleteMany({ author: user._id });
    await RefreshToken.deleteOne({ _id: user._id });

    next();
})

export default mongoose.model('User', UserSchema);