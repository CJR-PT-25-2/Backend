import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Req,
  UseInterceptors,
  UploadedFile, Query,
  DefaultValuePipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicProfileDto } from './dto/public-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { SelfGuard } from 'src/auth/guard/self.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/upload/upload.config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

 
  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,) {
    return this.userService.findAll({page, limit });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyProfile(@Req() req: Request) {
    const userId = parseInt((req as any).user.id, 10);

    return this.userService.findMyProfile(userId);
  }

  @Get(':id')
  async getPublicProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PublicProfileDto> {
    const profile = await this.userService.findPublicProfile(id);
    if (!profile) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return profile;
  }

  @UseGuards(AuthGuard('jwt'), SelfGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log("📸 BACKEND RECEBEU O ARQUIVO?", !!file);
    console.log("📄 FILE:", file);
    return this.userService.updateAvatar(id, file);
  }


  @UseGuards(AuthGuard('jwt'), SelfGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
