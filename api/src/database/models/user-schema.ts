import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import IUser from '../../types/IUser.js';
import { Page } from '../../util/internal.js';

const UserSchema = new Schema<IUser>({
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

async function handleUserDeletion(user: IUser | null) {
    if (!user) return;

    await Page.deleteMany({ author: user._id });
}

UserSchema.methods.updateTokenVersion = async function () {
    this.tokenVersion += 1;
    await this.save();
}

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    };

    this.password = await bcrypt.hash(this.password, 10);

    next();
})

// findOneAndDelete (also covers findByIdAndDelete)
UserSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getFilter());
    await handleUserDeletion(user);
    next();
});

// deleteOne (query middleware)
UserSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const user = await this.model.findOne(this.getFilter());
    await handleUserDeletion(user);
    next();
});

// deleteMany (bulk deletion)
UserSchema.pre('deleteMany', async function (next) {
    const users = await this.model.find(this.getFilter());
    for (const user of users) {
        await handleUserDeletion(user);
    }
    next();
});

export const User = mongoose.model<IUser>('User', UserSchema);