import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createContactValidation, getContactValidation } from "../validations/contact-validation.js";
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

export default {
    create,
    get
}