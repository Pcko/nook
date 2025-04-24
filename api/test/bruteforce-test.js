import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import authenticator from '../routes/authenticator.js';
import User from '../database/models/user-schema.js';

const app = express();
app.use(express.json());
app.use('/api', authenticator);

// BRUTE FORCE LOGIN TEST
describe('BRUTE FORCE LOGIN PROTECTION', () => {
    beforeAll(async () => {
        // connect to test database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // create test user
        await User.create({
            _id: 'testuser',
            username: 'testuser',
            password: await bcrypt.hash('TestPassword123!', 10),
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com'
        });
    });

    afterAll(async () => {
        // clear database and close connection
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('should block login after 5 failed attempts', async () => {
        // simulate 5 failed login attempts
        for (let i = 0; i < 5; i++) {
            const response = await request(app)
                .post('/api/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });

            expect([403, 400]).toContain(response.statusCode);
        }

        // 6th attempt should be rate-limited
        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(429);
        expect(response.body.message).toMatch(/too many login attempts/i);
    });
});
