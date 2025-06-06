import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schema/user.schema";
import { UserService } from "../service/user.service";
import { UserController } from "../controller/user.controller";


@Module({
    imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
    providers:[UserService],
    controllers:[UserController],
    exports:[UserService]
})
export class UserModule {}