<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Rotas no Nest.js
No Nest.js, as rotas são definidas utilizando decorators como @Controller e @Put.

Exemplo:
```
  @Controller('/usuarios')
export class UsuarioController {
  @Put('/:id')
  atualizarUsuario(@Param('id') id: string, @Body() dadosAtualizados: AtualizarUsuarioDTO) {
    // Lógica para atualizar um usuário
  }
}

```

- @Controller('/usuarios'): Define um controlador que agrupa as rotas relacionadas a "usuários". Todas as rotas dentro desse controlador começarão com /usuarios.
- @Put('/:id'): Define uma rota HTTP do tipo PUT, que recebe um parâmetro id. Essa rota seria acessada como, por exemplo, PUT /usuarios/123.


## Criação de Decorators Personalizados
No Nest.js, é possível criar decorators personalizados para encapsular lógica reutilizável.

Exemplo: Validação Personalizada de Email
Aqui está um exemplo de como criar um decorator para validar emails únicos em um sistema:

Implementação do Validador:
```
import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from './../usuario.repository';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailValidator implements ValidatorConstraintInterface {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const isEmailUser = await this.usuarioRepository.isEmailValido(value);
    return !isEmailUser; // Retorna verdadeiro se o email NÃO estiver em uso
  }
}

```

- @Injectable: Este decorator transforma a classe EmailValidator em um provedor injetável dentro do ecossistema do Nest.js.
- @ValidatorConstraint({ async: true }): Indica que esta classe é uma restrição de validação e que a validação será feita de forma assíncrona.

Implementação do Decorator:
```
export const singleEmail = (validationOptions: ValidationOptions) => {
  return (object: Object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: EmailValidator
    });
  };
};

```

- registerDecorator: Registra um decorator que será aplicado em propriedades de classes. Aqui estamos associando a lógica de validação ao validador EmailValidator.


Uso do Decorator no DTO:
```
export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name can not be empty' })
  nome: string;

  @IsEmail(undefined, { message: 'Email format invalid!' })
  @singleEmail({ message: 'User already exists' })
  email: string;

  @MinLength(6, { message: 'Password must have more than 6 characters' })
  senha: string;
}

```

- @IsNotEmpty: Valida que o campo não pode ser vazio.
- @IsEmail: Valida que o campo possui o formato de um email.
- @singleEmail: Valida que o email é único utilizando o EmailValidator personalizado.

## Validações com class-validator
A biblioteca class-validator é usada para aplicar validações em objetos baseados em classes. Decorators são utilizados para definir regras diretamente no DTO (Data Transfer Object).

Exemplo de Validadores Comuns:
- @IsNotEmpty: Garante que o campo não seja vazio.
- @IsEmail: Valida o formato do email.
- @MinLength: Define o comprimento mínimo de um campo.

## O que é @Injectable?
O decorator @Injectable marca uma classe como um provedor que pode ser injetado em outros componentes usando o sistema de injeção de dependências do Nest.js.
Exemplo:
```@Injectable()
export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async criarUsuario(dados: CreateUserDTO) {
    return this.usuarioRepository.save(dados);
  }

 async listar() {
    return this.usuarios
  }
}
```

- O @Injectable permite que o UsuarioRepository seja injetado no UsuarioService, facilitando o acesso às operações de banco de dados ou lógica de negócios, esse método facilita, para que não seja preciso instanciar a classe sempre que quiser utiliza-la, ou seja, sem ele, precisaríamos fazer new --nome--classe-- para conseguir utilizar os métodos dentro dela, com o Injectable, não é necessário, baste apenas fazer o seguinte para utilizar os métodos dentro da classe com ela ja "injetada"
```
// Passar nome da classe no construtor como abaixo:
constructor(private usuarioRepository: UsuarioRepository) {}


// e dai é so usar da seguinte forma:
    const usuariosSalvos = await this.usuarioRepository.listar()
```
