import {Entity, Column, BaseEntity, PrimaryGeneratedColumn, BeforeInsert} from "typeorm";
import * as bcrypt from  "bcryptjs";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar",{length:255})
    email: string;

  
    @Column("varchar",{length:255})
    password: string;

    @Column("tinyint",{default:0})
    confirmed:boolean;

    @Column("tinyint",{default:0})
    forgotPasswordLocked:boolean;

    @BeforeInsert()
    async hashPassword(){
        this.password=await bcrypt.hash(this.password,10);
    }

}
