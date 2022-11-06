import { Delete, Get, Post, Put, Query, Route, Tags } from "tsoa";
import { IKataController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../utils/logger";

// ORM - Users Collection
import { getAllKatas, getKataByID, updateKataByID, deleteKataByID, createKata } from "../domain/orm/Kata.orm";
import { IKata } from "@/domain/interfaces/IKata.interface";

@Route("/api/katas")
@Tags("KatasController")
export class KatasController implements IKataController {

    /**
     * Endpoint to retreive the katas in the Collection "Katas" of DB 
     * @param {string} id Id of Kata to retreive (optional)
     * @returns All katas o kata found by ID
     */
     @Get("/")
     public async getKatas(@Query()page: number, @Query()limit: number, @Query()id?: string): Promise<any> {
         
         let response: any = '';
         
         if(id){
             LogSuccess(`[/api/katas] Get Kata By ID: ${id} `);
             response = await getKataByID(id);
         }else {
             LogSuccess('[/api/katas] Get All Katas Request')
             response = await getAllKatas(page, limit);
         }
         
         return response;
     }

     @Post("/")
     public async createKata(kata: IKata): Promise<any> {
 
         let response: any = '';
 
         if(kata){
             LogSuccess(`[/api/katas] Create New Kata: ${kata.name} `);
             await createKata(kata).then((r) => {
                 LogSuccess(`[/api/katas] Created Kata: ${kata.name} `);
                 response = {
                     message: `Kata created successfully: ${kata.name}`
                 }
             });
         }else {
             LogWarning('[/api/katas] Register needs Kata Entity')
             response = {
                 message: 'Kata not Registered: Please, provide a Kata Entity to create one'
             }
         }
         return response;
     }

    /**
     * Endpoint to delete the Katas in the Collection "Katas" of DB 
     * @param {string} id Id of Kata to delete (optional)
     * @returns message informing if deletion was correct
     */
     @Delete("/")
     public async deleteKata(@Query()id?: string): Promise<any> {
         
         let response: any = '';
         
         if(id){
             LogSuccess(`[/api/katas] Delete Kata By ID: ${id} `);
             await deleteKataByID(id).then((r) => {
                 response =  {
                     message: `Kata with id ${id} deleted successfully`
                 }
             })
         }else {
             LogWarning('[/api/katas] Delete Kata Request WITHOUT ID')
             response = {
                 message: 'Please, provide an ID to remove from database'
             }
         }
         
         return response;
     }

     @Put("/")
     public async updateKata(@Query()id: string, kata: IKata): Promise<any> {
         
         let response: any = '';
         
         if(id){
             LogSuccess(`[/api/katas] Update Kata By ID: ${id} `);
             await updateKataByID(id, kata).then((r) => {
                 response =  {
                     message: `Kata with id ${id} updated successfully`
                 }
             })
         }else {
             LogWarning('[/api/katas] Update Kata Request WITHOUT ID')
             response = {
                 message: 'Please, provide an ID to update an existing user'
             }
         }
         
         return response;
     }

}