import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UsuarioRepository } from "./usuario.repository";
import { createUserDTO } from "./dto/createUser.dto";
import { UsuarioEntity } from "./usuario.entity";
import { v4 as uuid } from 'uuid';
import { getUserListoDTO } from "./dto/getUserList.dto";
import { updateUserDTO } from "./dto/updateUser.dto";

@Controller('/usuarios')
export class UsuarioController {

  constructor(private usuarioRepository: UsuarioRepository) {

  }

  @Post()
  async createUser(@Body() usersData: createUserDTO) {
    const usuarioEntity = new UsuarioEntity()
    usuarioEntity.email = usersData.email
    usuarioEntity.senha = usersData.senha
    usuarioEntity.nome = usersData.nome
    usuarioEntity.id = uuid()

    this.usuarioRepository.salvar(usuarioEntity)
    return { usuario: new getUserListoDTO(usuarioEntity.id, usuarioEntity.nome), messsage: 'User Created!' }
  }

  @Get()
  async getAllUsers() {
    const usuariosSalvos = await this.usuarioRepository.listar()
    const usuariosLista = usuariosSalvos.map(usuario => new getUserListoDTO(
      usuario.id,
      usuario.nome
    ))

    return usuariosLista
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() newData: updateUserDTO) {
    const usuarioAtualizdo = await this.usuarioRepository.atualizar(id, newData)
    return { usuario: usuarioAtualizdo, message: 'User updated!' }
  }
}