import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { singleEmail } from "../validation/email-validator"

export class createUserDTO {
  
  @IsNotEmpty({ message: 'Name can not been empty' })
  nome: string

  @IsEmail(undefined, { message: 'Email format invalid!' })
  @singleEmail({ message: 'User already exists' })
  email: string

  @MinLength(6, { message: 'Password must have more than 6 caractheres' })
  senha: string
}