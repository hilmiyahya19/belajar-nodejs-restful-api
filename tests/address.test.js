import supertest from "supertest";
import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContacts, removeTestUser } from "./test-util";
import { logger } from "../src/application/logging";
import { web } from "../src/application/web";

// ================================================
// TEST POST ADDRESS
// ================================================
describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new address', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: 'negara test',
                postal_code: '123456',
        });

        // logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe('jalan test');
        expect(response.body.data.city).toBe('kota test');
        expect(response.body.data.province).toBe('provinsi test');
        expect(response.body.data.country).toBe('negara test');
        expect(response.body.data.postal_code).toBe('123456');
    });

    it('should reject if address request body is invalid', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: '',
                postal_code: '',
        });

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .post('/api/contacts/' + (testContact.id + 1) + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: '',
                postal_code: '',
        });

        // logger.info(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
})

// ================================================
// TEST GET ADDRESS
// ================================================
describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    })

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get address by id', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const response = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(testAddress.id);
        expect(response.body.data.street).toBe(testAddress.street);
        expect(response.body.data.city).toBe(testAddress.city);
        expect(response.body.data.province).toBe(testAddress.province);
        expect(response.body.data.country).toBe(testAddress.country);
        expect(response.body.data.postal_code).toBe(testAddress.postal_code);  
    });

    it('should reject if contact id not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const response = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        logger.info(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject if address id not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const response = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test');

        logger.info(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
})

// ================================================
// TEST UPDATE ADDRESS
// ================================================