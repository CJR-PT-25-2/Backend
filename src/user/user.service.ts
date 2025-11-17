import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicProfileDto } from './dto/public-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const salt = 10;
    const senhaHash = await bcrypt.hash(createUserDto.senha, salt);
    const user = await this.prisma.usuario.create({
      data: { ...createUserDto, senha: senhaHash },
    });
    return user;
  }

  async findAll() {
    return await this.prisma.usuario.findMany();
  }

  async findMyProfile(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senha, ...profile } = user;
    return profile;
  }

  async findPublicProfile(id: number): Promise<PublicProfileDto> {
    const userProfile = await this.prisma.usuario.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        username: true,
        foto__perfil_URL: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return userProfile;
  }

  async findOne(id: number) {
    if (!id) {
      throw new Error('Usuario não encontrado');
    }
    return await this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.senha) {
      const salt = 10;
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, salt);
    }
    try {
      return await this.prisma.usuario.update({
        where: { id: id },
        data: { ...updateUserDto },
      });
    } catch (error) {
      throw new NotFoundException(
        `Não foi possível atualizar o usuário com ID ${id}.`,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.usuario.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(`Usuário com o ID ${id} não encontrado.`);
    }
  }
}
