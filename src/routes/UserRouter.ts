import express, { Request, Response } from "express";
import { UserController  } from "../controller/UsersController";
import { LogInfo } from "../utils/logger";

// Body Parser to read BODY from requests
import bodyParser from "body-parser";

let jsonParser = bodyParser.json();

// JWT Verifier MiddleWare
import { verifyToken } from '../middlewares/verifyToken.middleware';


// Router from express
let usersRouter = express.Router();


// http://localhost:8000/api/users?id=6253dc47f30baed4c6de7f99
usersRouter.route('/')
    // GET:
    .get(verifyToken, async (req: Request, res: Response) => {
        // Obtain a Query Param (ID)
        let id: any = req?.query?.id;

        // Pagination
        let page: any = req?.query?.page || 1;
        let limit: any = req?.query?.limit || 10;

        LogInfo(`Query Param: ${id}`);
        // Controller Instance to excute method
        const controller: UserController = new UserController();
        // Obtain Reponse
        const response: any = await controller.getUsers(page, limit, id)
        // Send to the client the response
        return res.status(200).send(response);
    })
    // DELETE:
    .delete(verifyToken, async (req:Request, res: Response) => {
        // Obtain a Query Param (ID)
        let id: any = req?.query?.id;
        LogInfo(`Query Param: ${id}`);
        // Controller Instance to excute method
        const controller: UserController = new UserController();
        // Obtain Reponse
        const response: any = await controller.deleteUser(id);
        // Send to the client the response
        return res.status(200).send(response);
    })
    .put(verifyToken, async (req:Request, res: Response) => {
        // Obtain a Query Param (ID)
        let id: any = req?.query?.id;
        let name: any = req?.query?.name;
        let email: any = req?.query?.email;
        let age: any = req?.query?.age;
        LogInfo(`Query Params: ${id}, ${name}, ${age}, ${email}`);

        // Controller Instance to excute method
        const controller: UserController = new UserController();

        let user = {
            name: name,
            email: email,
            age: age
        }

        // Obtain Response
        const response: any = await controller.updateUser(id, user);

        // Send to the client the response
        return res.status(200).send(response);

    });

// http://localhost:8000/api/users?id=6253dc47f30baed4c6de7f99
usersRouter.route('/katas')
    .get(verifyToken, async (req: Request, res: Response) => {
        // Obtain a Query Param (ID)
        let id: any = req?.query?.id;

        // Pagination
        let page: any = req?.query?.page || 1;
        let limit: any = req?.query?.limit || 10;

        // Controller Instance to excute method
        const controller: UserController = new UserController();
        // Obtain Reponse
        const response: any = await controller.getKatas(page, limit, id)
        // Send to the client the response
        return res.status(200).send(response);

    });


// Export Users Router
export default usersRouter;

/**
 * 
 * Get Documents => 200 OK
 * Creation Documents => 201 OK
 * Deletion of Documents => 200 (Entity) / 204 (No return)
 * Update of Documents =>  200 (Entity) / 204 (No return)
 * 
 */
