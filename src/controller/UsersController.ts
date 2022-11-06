import { Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { IUserController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../utils/logger";

// ORM - Users Collection
import { getAllUsers, getUserByID, deleteUserByID, updateUserByID, getKatasFromUser } from "../domain/orm/User.orm";


@Route("/api/users")
@Tags("UserController")
export class UserController implements IUserController {
    /**
     * Endpoint to retreive the Users in the Collection "Users" of DB 
     * @param {string} id Id of user to retreive (optional)
     * @returns All user o user found by iD
     */
    @Get("/")
    public async getUsers(@Query()page: number, @Query()limit: number, @Query()id?: string): Promise<any> {
        
        let response: any = '';
        
        if(id){
            LogSuccess(`[/api/users] Get User By ID: ${id} `);
            response = await getUserByID(id);
        }else {
            LogSuccess('[/api/users] Get All Users Request')
            response = await getAllUsers(page, limit);
        }
        
        return response;
    }
    /**
     * Endpoint to delete the Users in the Collection "Users" of DB 
     * @param {string} id Id of user to delete (optional)
     * @returns message informing if deletion was correct
     */
    @Delete("/")
    public async deleteUser(@Query()id?: string): Promise<any> {
        
        let response: any = '';
        
        if(id){
            LogSuccess(`[/api/users] Delete User By ID: ${id} `);
            await deleteUserByID(id).then((r) => {
                response =  {
                    message: `User with id ${id} deleted successfully`
                }
            })
        }else {
            LogWarning('[/api/users] Delete User Request WITHOUT ID')
            response = {
                message: 'Please, provide an ID to remove from database'
            }
        }
        
        return response;
    }
    @Put("/")
    public async updateUser(@Query()id: string, user: any): Promise<any> {
        
        let response: any = '';
        
        if(id){
            LogSuccess(`[/api/users] Update User By ID: ${id} `);
            await updateUserByID(id, user).then((r) => {
                response =  {
                    message: `User with id ${id} updated successfully`
                }
            })
        }else {
            LogWarning('[/api/users] Update User Request WITHOUT ID')
            response = {
                message: 'Please, provide an ID to update an existing user'
            }
        }
        
        return response;
    }

    @Get('/katas')
    public async  getKatas(@Query()page: number, @Query()limit: number, @Query()id: string): Promise<any> {
        let response: any = '';

        if(id){
            LogSuccess(`[/api/users/katas] Get Katas from User By ID: ${id} `);
            response = await getKatasFromUser(page, limit, id);
        }else {
            LogSuccess('[/api/users/katas] Get All Katas without id')
            response = {
                message: 'ID from user is needed'
            }
        }
        
        return response;
        
    }


}

