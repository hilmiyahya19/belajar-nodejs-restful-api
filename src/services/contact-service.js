import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createContactValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validations/contact-validation.js";
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

const remove = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const foundContact = await prismaClient.contact.count({
        where: {
            // jangan sampai mengambil data contact milik user lain
            username: user.username,
            id: contactId
        }
    });

    if (foundContact !== 1) {
        throw new ResponseError(404, "Contact not found");
    }

    return prismaClient.contact.delete({
        where: {
            id: contactId
        }
    });
}

const search = async (user, request) => {
    request = validate(searchContactValidation, request);

    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10
    const skip = (request.page - 1) * request.size; 

    const filters = [];

    filters.push({
        username: user.username
    })

    if (request.name) {
        filters.push({
            OR: [
                {
                    first_name: {
                        contains: request.name,
                    }
                },
                {
                    last_name: {
                        contains: request.name,
                    }
                }  
            ]
        });
    }
    
    if (request.email) {
        filters.push({
            email: {
                contains: request.email,
            }
        });
    }

    if (request.phone) {
        filters.push({
            phone: {
                contains: request.phone,
            }
        });
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip,
    });

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    });

    return {
        data: contacts,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}