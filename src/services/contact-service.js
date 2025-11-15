import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createContactValidation, getContactValidation, updateContactValidation } from "../validations/contact-validation.js";
import { validate } from "../validations/validation.js";

const create = async (user, request) => {
    const validatedData = validate(createContactValidation, request);
    validatedData.username = user.username;

    return prismaClient.contact.create({ 
        data: validatedData,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const foundContact = await prismaClient.contact.findFirst({
        where: {
            // jangan sampai mengambil data contact milik user lain
            username: user.username,
            id: contactId
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });

    if (!foundContact) {
        throw new ResponseError(404, "Contact not found");
    }

    return foundContact;
}

const update = async (user, request) => {
    const validatedData = validate(updateContactValidation, request);
    
    const foundContact = await prismaClient.contact.count({
        where: {
            // jangan sampai mengambil data contact milik user lain
            username: user.username,
            id: validatedData.id
        }
    });

    if (foundContact !== 1) {
        throw new ResponseError(404, "Contact not found");
    }

    return prismaClient.contact.update({
        where: {
            id: validatedData.id
        },
        data: {
            first_name: validatedData.first_name,
            last_name: validatedData.last_name,
            email: validatedData.email,
            phone: validatedData.phone
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

export default {
    create,
    get,
    update
}