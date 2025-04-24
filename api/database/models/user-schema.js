import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import Project from './project-schema.js';

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
    tokenVersion: {
        type: Number,
        default: 0,
    },
    twoFactorAuthOn: {
        type: Boolean,
        default: false,
    },
    twoFactorAuthSecret: {
        type: String,
    }
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

UserSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getFilter());
    if (!user) return next();

    await Project.deleteMany({ author: user._id });

    next();
})

UserSchema.methods.updateTokenVersion = async function () {
    this.tokenVersion += 1;
    await this.save();
}


export default mongoose.model('User', UserSchema);