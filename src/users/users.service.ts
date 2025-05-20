import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (this.users.some((user) => user.email === createUserDto.email)) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = { id: (this.idCounter++).toString(), ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  async findAll(search?: string): Promise<User[]> {
    if (!search) {
      return this.users;
    }
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );
  }
  
  async findOne(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    if (
      updateUserDto.email &&
      updateUserDto.email !== this.users[userIndex].email &&
      this.users.some(
        (user, index) =>
          index !== userIndex && user.email === updateUserDto.email,
      )
    ) {
      throw new ConflictException('This email already exists');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  async remove(id: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    const removedUser = { ...this.users[userIndex] };
    this.users.splice(userIndex, 1);
    return removedUser;
  }
}
