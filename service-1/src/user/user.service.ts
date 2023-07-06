import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './entity/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findOneByOuterId(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ outerId: id });
  }

  async save(user: User) {
    await this.userRepository.save(user);
  }

  async create(user: UserDto, outerId: string) {
    const userEntity = new User(outerId, user.username);
    await this.save(userEntity);
  }

  async delete(id: number) {
    const userEntity = await this.userRepository.findOne({
      where: { id: id },
    });
    userEntity.isActive = false;
    await this.save(userEntity);
  }
}
