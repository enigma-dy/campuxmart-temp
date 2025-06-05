import { Injectable } from "@nestjs/common";
import { Mongoose } from "mongoose";

@Injectable()
export class DatabaseService{
    constructor(private readonly mongoose:Mongoose){}
    
    getMongooseInstance(): Mongoose {
    return this.mongoose;
  }
}