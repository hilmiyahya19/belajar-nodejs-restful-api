import supertest from "supertest";
import {web} from "../src/application/web.js";
// import { prismaClient } from "../src/application/database.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import { logger } from "../src/application/logging.js";
import bcrypt from "bcrypt";

// ================================================
// TEST REGISTER USER
// ================================================
describe('POST /api/users', () => {

    afterEach(async () => {
        await removeTestUser();
    });

    it('should register a new user', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123456',
                name: 'test'
        });

        // logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.password).toBeUndefined();
    });

    it('should reject if request body is invalid', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
        });

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123456',
                name: 'test'
        });

        // logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.password).toBeUndefined();

        response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123456',
                name: 'test'
        });

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

// ================================================
// TEST LOGIN USER
// ================================================
describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: '123456'
        });

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.token).not.toBe('test');
    });

    it('should reject login if request body is invalid', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
        });

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'salah'
        });

        // logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject login if username is wrong', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'salah',
                password: 'salah'
        });

        // logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

// ================================================
// TEST GET USER
// ================================================
describe ('GET /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it ('should can get current user', async () => {
        const response = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
    });

    it ('should reject if token is invalid', async () => {
        const response = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah');

        // logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
})

// ================================================
// TEST PATCH USER
// ================================================
describe ('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it ('should can update current user', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'Hilmi',
                password: '654321',
            });

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('Hilmi');        

        const user = await getTestUser();
        expect(await bcrypt.compare('654321', user.password)).toBe(true);
    });

    it ('should can update current user name', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'Hilmi',
            });

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('Hilmi');        
    });

    it ('should can update current user password', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: '654321',
            });

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        
        const user = await getTestUser();
        expect(await bcrypt.compare('654321', user.password)).toBe(true);
    });

    it ('should reject if request body is invalid', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'salah')
            .send({});

        // logger.info(response.body);

        expect(response.status).toBe(401);
    });
})

// ================================================
// TEST LOGOUT USER
// ================================================
describe ('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it ('should can logout user', async () => {
        const response = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe('OK');

        // cek di database, token harus null
        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it ('should reject logout if token is invalid', async () => {
        const response = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'salah');

        logger.info(response.body);

        expect(response.status).toBe(401);
    });
})