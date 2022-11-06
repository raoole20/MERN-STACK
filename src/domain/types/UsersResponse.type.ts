import { IUser } from "../interfaces/IUser.interface"

export type UserResponse = {
    users: IUser[],
    totalPages: number,
    currentPage: number
}