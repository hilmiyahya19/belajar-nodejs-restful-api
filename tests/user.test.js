import supertest from "supertest";
import {web} from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
// import { logger } from "../src/application/logging.js";

describe('POST /api/users', () => {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: 'hilmi'
            }
        });
    });

    it('should register a new user', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'hilmi',
                password: '123456',
                name: 'Hilmi Yahya'
        });

        // logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('hilmi');
        expect(response.body.data.name).toBe('Hilmi Yahya');
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
                username: 'hilmi',
                password: '123456',
                name: 'Hilmi Yahya'
        });

        // logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('hilmi');
        expect(response.body.data.name).toBe('Hilmi Yahya');
        expect(response.body.data.password).toBeUndefined();

        response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'hilmi',
                password: '123456',
                name: 'Hilmi Yahya'
        });

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
})