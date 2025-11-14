import { prismaClient } from "../application/database.js";
import { createContactValidation } from "../validations/contact-validation.js";
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

export default {
    create
}