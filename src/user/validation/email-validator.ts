import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from './../usuario.repository';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidatorOptions, registerDecorator } from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailValidator implements ValidatorConstraintInterface{
  constructor(private usuarioRepository: UsuarioRepository) {}

 async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const isEmailUser = await this.usuarioRepository.isEmailValido(value)

    return !isEmailUser
  }
}

export const singleEmail = (validationOptions: ValidationOptions) => {
  return (object: Object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: EmailValidator 
    })
  }
} 