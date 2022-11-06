import { Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { IAuthController } from './interfaces';
import { LogSuccess, LogError, LogWarning } from "../utils/logger";
import { IUser } from "../domain/interfaces/IUser.interface";
import { IAuth } from "../domain/interfaces/IAuth.interface";

// ORM imports
import { registerUser, loginUser, logoutUser, getUserByID } from "../domain/orm/User.orm";
import { AuthResponse, ErrorResponse } from "./types";


@Route("/api/auth")
@Tags("AuthController")
export class AuthController implements IAuthController {
    
    @Post("/register")
    public async registerUser(user: IUser): Promise<any> {

        let response: any = '';

        if(user){
            LogSuccess(`[/api/auth/register] Register New User: ${user.email} `);
            await registerUser(user).then((r) => {
                LogSuccess(`[/api/auth/register] Created User: ${user.email} `);
                response = {
                    message: `User created successfully: ${user.name}`
                }
            });
        }else {
            LogWarning('[/api/auth/register] Register needs User Entity')
            response = {
                message: 'User not Registered: Please, provide a User Entity to create one'
            }
        }
        return response;
    }

    @Post("/login")
    public async loginUser(auth: IAuth): Promise<any> {

        let response: AuthResponse | ErrorResponse | undefined;

        if(auth){
            LogSuccess(`[/api/auth/login] Login User: ${auth.email} `);
            let data = await loginUser(auth);
            response = {
                token: data.token,
                message: `Welcome, ${data.user.name}`
            }
        }else {
            LogWarning('[/api/auth/login] Login needs Auth Entity (email && password')
            response = {
                error: '[AUTH ERROR]: Email & Password are needed',
                message: 'Please, provide a email && password to login'
            }
        }

        return response;

    }

    /**
     * Endpoint to retreive the User in the Collection "Users" of DB
     * Middleware: Validate JWT
     * In headers you must add the x-access-token with a valid JWT
     * @param {string} id Id of user to retreive (optional)
     * @returns All user o user found by iD
     */
     @Get("/me")
     public async userData(@Query()id: string): Promise<any> {
         
         let response: any = '';
         
         if(id){
             LogSuccess(`[/api/users] Get User Data By ID: ${id} `);
             response = await getUserByID(id);
         }
         
         return response;
     }


    @Post("/logout")
    public async logoutUser(): Promise<any>{

        let response: any = '';

         // TODO: Close Session of user
         throw new Error("Method not implemented.");
    }
    
}

