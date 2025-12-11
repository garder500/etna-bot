import type Bot from "@/bot";
import type { PrismaClient } from "@db/client";
import type { Snowflake } from "discord.js";
import { loginEtna, requestIntraApi } from "./etna";

export interface UserIdentity {
  id: number
  login: string
  firstname: string
  lastname: string
  phone: any
  promo: string
  email: string
  close: any
  deleted_at: any
}


export default class Intra {
    login: string = "";
    sessionToken: string = "";
    constructor(id: Snowflake, database: PrismaClient, bot: Bot){
        database.user.findUnique({
            where:{
                id
            }
        }).then(user => {
            if (user){
                if(user.login) this.login = bot.decryptString(user.login) || "";

                if(user.sessionCookie){
                    this.sessionToken= user.sessionCookie
                }else{
                   if(user.login && user.password){
                     let login = bot.decryptString(user.login), password= bot.decryptString(user.password);
                     if(login && password){
                        loginEtna(login, password).then(token => {
                            this.sessionToken = token;
                        }).catch(err => {
                            bot.logger?.error(err);
                        })
                     }
                   }
                }

            }
        })
    }

    async getIdentity(): Promise<UserIdentity | undefined>{
        const request = await requestIntraApi(`/users/${this.login}`, {
            method: "GET"
        }, this.sessionToken);

        if(request.ok){
            return (await request.json()) as UserIdentity;
        }

        return undefined;
    }
}