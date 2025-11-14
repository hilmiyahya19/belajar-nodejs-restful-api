import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// ================================================
// REGISTER USER
// ================================================
const register = async (request) => {
    // validate input
    const validatedData = validate(registerUserValidation, request);

    // cek username apakah sudah dipakai
    const existingUserCount = await prismaClient.user.count({
        where: {
            username: validatedData.username
        }
    });

    if (existingUserCount === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    validatedData.password = hashedPassword;

    // create user di database
    const createdUser = await prismaClient.user.create({
        data: validatedData,
        select: {
            username: true,
            name: true
        }
    });

    return createdUser;
};


// ================================================
// LOGIN USER
// ================================================
const login = async (request) => {
    // validate input login
    const validatedLogin = validate(loginUserValidation, request);

    // cari user berdasarkan username
    const foundUser = await prismaClient.user.findUnique({
        where: {
            username: validatedLogin.username
        },
        select: {
            username: true,
            password: true
        }
    });

    if (!foundUser) {
        throw new ResponseError(401, "Username or password wrong");
    }

    // verifikasi password
    const passwordMatch = await bcrypt.compare(validatedLogin.password, foundUser.password);
    if (!passwordMatch) {
        throw new ResponseError(401, "Username or password wrong");
    }

    // generate token login baru
    const generatedToken = uuid().toString();

    // simpan token ke database dan kembalikan ke client
    const updatedUser = await prismaClient.user.update({
        data: {
            token: generatedToken
        },
        where: {
            username: foundUser.username
        },
        select: {
            token: true
        }
    });

    return updatedUser;
};


// ================================================
// GET USER BY USERNAME
// ================================================
const get = async (username) => {
    // validate input username
    username = validate(getUserValidation, username);

    // ambil data user berdasarkan username
    const foundUser = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    });

    if (!foundUser) {
        throw new ResponseError(404, "User not found");
    }

    return foundUser;
};

// ================================================
// UPDATE USER
// ================================================
const update = async (request) => {
    const user = validate(updateUserValidation, request);

    // cek apakah username ada di database
    const existingUserCount = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (existingUserCount !== 1) {
        throw new ResponseError(404, "User not found");
    }

    // hanya update field yang diisi user
    const data = {};

    if (user.name) {
        data.name = user.name;
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    // update ke database
    const updatedUser = await prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    });

    return updatedUser;
};

// ================================================
// LOGOUT USER
// ================================================
const logout = async (username) => {
    // validate input username
    username = validate(getUserValidation, username);

    // ambil data user berdasarkan username
    const foundUser = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!foundUser) {
        throw new ResponseError(404, "User not found");
    }

    // simpan token ke database dan kembalikan ke client
    const updatedUser = await prismaClient.user.update({
        where: {
            username: foundUser.username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    });

    return updatedUser;
}


// ================================================
// EXPORT
// ================================================
export default {
    register,
    login,
    get,
    update,
    logout
};