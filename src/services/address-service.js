import { prismaClient } from "../application/database.js";
import { getContactValidation } from "../validations/contact-validation.js";
import { validate } from "../validations/validation.js"
import { ResponseError } from "../error/response-error.js";
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validations/address-validation.js";

const checkContactMustExist = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const foundContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    });

    if (foundContact !== 1) {
        throw new ResponseError(404, "Contact not found");
    }

    return contactId;
}

const create = async (user, contactId, request) => {
    contactId = await checkContactMustExist(user, contactId);

    const validatedData = validate(createAddressValidation, request);
    validatedData.contact_id = contactId;  
    
    return prismaClient.address.create({ 
        data: validatedData,
        select: {
            id: true,
            street: true,
            city: true,
            province: true, 
            country: true,
            postal_code: true
        }
    });
}

const get = async (user, contactId, addressId) => {
    contactId = await checkContactMustExist(user, contactId);

    const validatedData = validate(getAddressValidation, addressId);

    const foundAddress = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: validatedData
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true, 
            country: true,
            postal_code: true
        }
    });

    if (!foundAddress) {
        throw new ResponseError(404, "Address not found");
    }

    return foundAddress;
}

const update = async (user, contactId, request) => {
    contactId = await checkContactMustExist(user, contactId);

    const validatedData = validate(updateAddressValidation, request);

    const foundAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: validatedData.id
    }
    });

    if (foundAddress !== 1) {
        throw new ResponseError(404, "Address not found");
    }

    return prismaClient.address.update({
        where: {
            id: validatedData.id
        },
        data: {
            street: validatedData.street,
            city: validatedData.city,
            province: validatedData.province, 
            country: validatedData.country,
            postal_code: validatedData.postal_code
        }, 
        select: {
            id: true,
            street: true,
            city: true,
            province: true, 
            country: true,
            postal_code: true
        }
    });
}

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExist(user, contactId);

    const validatedData = validate(getAddressValidation, addressId);

    const foundAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: validatedData
        }
    });

    if (foundAddress !== 1) {
        throw new ResponseError(404, "Address not found");
    }

    return prismaClient.address.delete({
        where: {
            id: validatedData
        }
    });
}

const list = async (user, contactId) => {
    contactId = await checkContactMustExist(user, contactId);
    
    return prismaClient.address.findMany({
        where: {
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true, 
            country: true,
            postal_code: true
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    list
}