import mongoose from 'mongoose';

const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

export default mongoose.model('RefreshToken', RefreshTokenSchema, 'refreshTokens');