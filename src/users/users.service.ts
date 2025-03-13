import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from './password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      select: {
        password: true,
        avatar: true,
        created_at: true,
        email: true,
        games: true,
        id: true,
        username: true,
      },
    });

    console.log(user);
    return user ?? undefined;
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return undefined;
    return user;
  }

  async create(createDto: CreateUserDto) {
    const exists = await this.userRepository.exists({
      where: { username: createDto.username },
    });
    if (exists) throw new ConflictException('Username already exists');
    const hashed: string = await this.passwordService.hash(createDto.password);
    const user = this.userRepository.create({
      ...createDto,
      password: hashed,
    });
    await this.userRepository.save(user);
    return user;
  }
}
