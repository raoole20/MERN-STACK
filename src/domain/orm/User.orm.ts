import { userEntity } from "../entities/User.entity";

import { LogSuccess, LogError } from "../../utils/logger";
import { IUser } from "../interfaces/IUser.interface";
import { IAuth } from "../interfaces/IAuth.interface";

// Environment variables
import dotenv from 'dotenv';

// BCRYPT for passwords
import bcrypt from 'bcrypt';

// JWT
import jwt from 'jsonwebtoken';
import { UserResponse } from "../types/UsersResponse.type";
import { kataEntity } from "../entities/Kata.entity";
import { IKata } from "../interfaces/IKata.interface";
import mongoose from "mongoose";

// Configuration of environment variables
dotenv.config();

// Obtain Secret key to generate JWT
const secret = process.env.SECRETKEY || 'MYSECRETKEY';

// CRUD

/**
 * Method to obtain all Users from Collection "Users" in Mongo Server
 */
export const getAllUsers = async (page: number, limit: number): Promise<any[] | undefined> => {
    try {
        let userModel = userEntity();

        let response: any = {};

        // Search all users (using pagination)
        await userModel.find({isDeleted: false})
            .select('name email age katas')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((users: IUser[]) => {
                response.users = users;
            });
        
        // Count total documents in collection "Users"
        await userModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit);
            response.currentPage = page;
        });

        return response;

    } catch (error) {
        LogError(`[ORM ERROR]: Getting All Users: ${error}`);
    }
}

// - Get User By ID
export const getUserByID = async (id: string) : Promise<any | undefined> => {

    try {
        let userModel = userEntity();

        // Search User By ID
        return await userModel.findById(id).select('name email age katas');

    } catch (error) {
        LogError(`[ORM ERROR]: Getting User By ID: ${error}`);
    }

}

// - Delete User By ID
export const deleteUserByID = async (id: string): Promise<any | undefined> => {

    try {
        let userModel = userEntity();

        // Delete User BY ID
        return await userModel.deleteOne({ _id: id })

    } catch (error) {
        LogError(`[ORM ERROR]: Deleting User By ID: ${error}`);
    }

}

// - Update User By ID
export const updateUserByID = async (id: string, user: any): Promise<any | undefined> => {

    try {
        
        let userModel = userEntity();

        // Update User
        return await userModel.findByIdAndUpdate(id, user);

    } catch (error) {
        LogError(`[ORM ERROR]: Updating User ${id}: ${error}`);
    }

}

// Register User
export const registerUser = async (user: IUser): Promise<any | undefined> => {
    try {
        
        let userModel = userEntity();

        // Create / Insert new User
        return await userModel.create(user);

    } catch (error) {
        LogError(`[ORM ERROR]: Creating User: ${error}`);
    }

}

// Login User
export const loginUser = async (auth: IAuth): Promise<any | undefined> => {
    try {
        
        let userModel = userEntity();

        let userFound: IUser | undefined = undefined;
        let token = undefined;

        // Check if user exists by Unique Email
        await userModel.findOne({email: auth.email}).then((user: IUser) => {
            userFound = user;
        }).catch((error) => {
            console.error(`[ERROR Authentication in ORM]: User Not Found`);
            throw new Error(`[ERROR Authentication in ORM]: User Not Found: ${error}`);
        });

        // Check if Password is Valid (compare with bcrypt)
        let validPassword = bcrypt.compareSync(auth.password, userFound!.password);

        if(!validPassword){
            console.error(`[ERROR Authentication in ORM]: Password Not Valid`);
            throw new Error(`[ERROR Authentication in ORM]: Password Not Valid`);
        }

        // Generate our JWT
        token = jwt.sign({email: userFound!.email}, secret, {
            expiresIn: "2h" 
        });

        return {
            user: userFound,
            token: token
        }

    } catch (error) {
        LogError(`[ORM ERROR]: Creating User: ${error}`);
    }
}

// Logout User
export const logoutUser = async (): Promise<any | undefined> => {
    // TODO: NOT IMPLEMENTED
}




/**
 * Method to obtain all Users from Collection "Users" in Mongo Server
 */
 export const getKatasFromUser = async (page: number, limit: number, id:string ): Promise<any[] | undefined> => {
    try {
        let userModel = userEntity();
        let katasModel = kataEntity();

        let katasFound: IKata[] = [];

        let response: any = {
            katas: []
        };

        console.log('User ID', id);

        await userModel.findById(id).then(async (user: IUser) => {
            response.user = user.email;
            
            // console.log('Katas from User', user.katas);

            // Create types to search
            let objectIds:mongoose.Types.ObjectId[]  = [];
            user.katas.forEach((kataID: string) => {
                let objectID = new mongoose.Types.ObjectId(kataID);
                objectIds.push(objectID);
            });

            await katasModel.find({"_id": {"$in": objectIds }}).then((katas: IKata[]) => {
                katasFound = katas;
            });

        }).catch((error) => {
            LogError(`[ORM ERROR]: Obtaining User: ${error}`);
        })

        response.katas = katasFound;

        return response;

    } catch (error) {
        LogError(`[ORM ERROR]: Getting All Users: ${error}`);
    }
}
