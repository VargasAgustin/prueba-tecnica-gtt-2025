import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  private profiles: Profile[] = [];
  private idCounter = 1;

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const newProfile = {
      id: (this.idCounter++).toString(),
      ...createProfileDto,
    };
    this.profiles.push(newProfile);
    return newProfile;
  }
  
  async findAll(): Promise<Profile[]> {
    return this.profiles;
  }

  async findOne(id: string): Promise<Profile> {
    const profile = this.profiles.find((profile) => profile.id === id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      throw new NotFoundException('Profile not found');
    }
    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updateProfileDto,
    };
    return this.profiles[profileIndex];
  }

  async remove(id: string) {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      throw new NotFoundException('Profile not found');
    }
    const removedProfile = { ...this.profiles[profileIndex] };
    this.profiles.splice(profileIndex, 1);
    return removedProfile;
  }
}
