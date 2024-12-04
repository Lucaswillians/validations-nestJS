import { Injectable } from "@nestjs/common"
import { UsuarioEntity } from "./usuario.entity"

@Injectable()
export class UsuarioRepository {
  private usuarios: UsuarioEntity[] = []

  async salvar(user: UsuarioEntity) {
    this.usuarios.push(user)
  }

  async listar() {
    return this.usuarios
  }

  async isEmailValido (email: string) {
    const possibleUser = this.usuarios.find(
      usuario => usuario.email === email
    )

    return possibleUser !== undefined
  }

  async atualizar (id: string, updatingData: Partial<UsuarioEntity>) {
    const possibleUser = this.usuarios.find(usuarioSalvo => usuarioSalvo.id === id)

    if (!possibleUser) throw new Error('User not found!')

    Object.entries(updatingData).forEach(([key, value]) => {
      if (key === 'id') {return}

      possibleUser[key] === value

      return possibleUser
    })
  }
}