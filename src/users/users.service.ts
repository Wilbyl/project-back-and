import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const usuarioExistent = await this.prismaService.users.findUnique({
      where: { email: createUserDto.email },
    });
    if (usuarioExistent) {
      throw new ConflictException('Email ja existe');
    }
    if (createUserDto.password == createUserDto.passwordConfirmation) {
      throw new ConflictException('senha não sao iguais');
    }

    delete createUserDto.passwordConfirmation;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 8);

    const createUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return createUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
