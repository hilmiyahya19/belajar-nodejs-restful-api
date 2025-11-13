import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { loginUserValidation, registerUserValidation } from "../validations/user-validation.js"
import { validate } from "../validations/validation.js"
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    // check if username already exists in database
    // method count() returns the number of users with the same username
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    // Throw an error if countUser === 1, which means a user with the same username already exists in the database
    if(countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    // hash password
    user.password = await bcrypt.hash(user.password, 10);

    // create user
    const newUser = await prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });

    return newUser;
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    // find user by username in database
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    // if user not found, throw an error
    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString();
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
}

export default {
    register,
    login
}