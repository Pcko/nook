import { User } from '../dist/util/internal.js';
import speakeasy from 'speakeasy';

(async () => {

    const result = await User.updateMany(
        { twoFactorAuthSecret: { $exists: false } }, // only old users
        { $set: { twoFactorAuthSecret: speakeasy.generateSecret().base32 } }
    );

    console.log(`Updated ${result.modifiedCount} users`);
})()