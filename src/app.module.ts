import { Module } from '@nestjs/common';
import { UsuarioModule } from './user/usuario.module';

@Module({
  imports: [UsuarioModule],
})

export class AppModule { }
