import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator"
import { singleEmail } from "../validation/email-validator"

export class updateUserDTO {

  @IsNotEmpty({ message: 'Name can not been empty' })
  @IsOptional()
  nome: string

  @IsEmail(undefined, { message: 'Email format invalid!' })
  @singleEmail({ message: 'User already exists' })
  @IsOptional()
  email: string

  @MinLength(6, { message: 'Password must have more than 6 caractheres' })
  @IsOptional()
  senha: string
}