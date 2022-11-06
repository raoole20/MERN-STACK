import { IKata } from "./IKata.interface"

export interface IUser {
    name: string,
    email: string,
    password: string
    age: number,
    katas: string[]
}