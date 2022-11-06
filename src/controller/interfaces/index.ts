import { IKata } from "../../domain/interfaces/IKata.interface";
import { IUser } from "../../domain/interfaces/IUser.interface";
import { BasicResponse } from "../types";

export interface IHelloController {
    getMessage(name?:string): Promise<BasicResponse>
}

export interface IUserController {
    // Read all users from database || get User By ID
    getUsers(page: number, limit: number, id?: string): Promise<any>
    // Get Katas of User
    getKatas(page: number, limit: number, id?: string): Promise<any>
    // Delete User By ID
    deleteUser(id?:string): Promise<any>
    // Update user
    updateUser(id:string, user: any): Promise<any>
}


export interface IAuthController {
    // register users
    registerUser(user: IUser):  Promise<any>
    // login user
    loginUser(auth: any): Promise<any>
}


export interface IKataController {
    // Read all users from database || get User By ID
    getKatas(page: number, limit: number, id?: string): Promise<any>
    // Create New Kata
    createKata(kata: IKata): Promise<any>
    // Delete Kata By ID
    deleteKata(id?:string): Promise<any>
    // Update Kata
    updateKata(id:string, kata: IKata): Promise<any>
}

