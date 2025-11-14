import supertest from "supertest";
import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import { createTestUser, removeAllTestContacts, removeTestUser } from "./test-util.js";

describe ('POST /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new contact', async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@gmail.com',
                phone: '081234567890'
        });

        logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe('test');
        expect(response.body.data.last_name).toBe('test');
        expect(response.body.data.email).toBe('test@gmail.com');
        expect(response.body.data.phone).toBe('081234567890');
    });

    it('should reject if request body is invalid', async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: 'test',
                email: 'test',
                phone: '0812345678901234567890'
        });

        logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});