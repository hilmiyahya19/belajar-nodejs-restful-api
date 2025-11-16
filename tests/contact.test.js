import supertest from "supertest";
// import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import { createManyTestContacts, createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from "./test-util.js";

// ================================================
// TEST POST CONTACT
// ================================================
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

        // logger.info(response.body);

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

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

// ================================================
// TEST GET CONTACT
// ================================================
describe ('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get contact by id', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .get('/api/contacts/' + testContact.id)
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(testContact.id);
        expect(response.body.data.first_name).toBe(testContact.first_name);
        expect(response.body.data.last_name).toBe(testContact.last_name);
        expect(response.body.data.email).toBe(testContact.email);
        expect(response.body.data.phone).toBe(testContact.phone);  
    });

    it('should return 404 if contact id not found', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
})

// ================================================
// TEST UPDATE CONTACT
// ================================================
describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can update contact', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')
            .send({
                first_name: 'Hilmi',
                last_name: 'Yahya',
                email: 'hilmi@gmail.com',
                phone: '081234567890'
        });

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(testContact.id);
        expect(response.body.data.first_name).toBe('Hilmi');
        expect(response.body.data.last_name).toBe('Yahya');
        expect(response.body.data.email).toBe('hilmi@gmail.com');
        expect(response.body.data.phone).toBe('081234567890');
    });

    it('should reject if request body is invalid', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: 'hilmi',
                phone: ''
        });

        // logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject if contact id not found', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .put('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'test')
            .send({
                first_name: 'Hilmi',
                last_name: 'Yahya',
                email: 'hilmi@gmail.com',
                phone: '081234567890'
        });

        // logger.info(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
})

// ================================================
// TEST DELETE CONTACT
// ================================================
describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can delete contact', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .delete('/api/contacts/' + testContact.id)
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        const contact = await getTestContact();
        expect(contact).toBeNull();
    });

    it('should reject if contact id not found', async () => {
        const testContact = await getTestContact();

        const response = await supertest(web)
            .delete('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
})

// ================================================
// TEST SEARCH CONTACT
// ================================================
describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContacts();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can search contact without parameter', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(2);
        expect(response.body.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({ 
                page: 2 
            })
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(5);
        expect(response.body.paging.page).toBe(2);
        expect(response.body.paging.total_page).toBe(2);
        expect(response.body.paging.total_item).toBe(15);
    });

    it('should can searrch using name', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({ 
                name: 'test 1' 
            })
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.total_item).toBe(6);
    });

    it('should can searrch using email', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({ 
                email: 'test1' 
            })
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.total_item).toBe(6);
    });

    it('should can searrch using phone', async () => {
        const response = await supertest(web)
            .get('/api/contacts')
            .query({ 
                phone: '0812345678901' 
            })
            .set('Authorization', 'test');

        // logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.total_item).toBe(6);
    });
})