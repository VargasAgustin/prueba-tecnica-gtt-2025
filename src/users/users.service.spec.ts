import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ProfileService } from 'src/profiles/profile.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let profileService: ProfileService;

  const mockProfileService = {
    findOne: jest.fn().mockResolvedValue({ id: 'profile1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    profileService = module.get<ProfileService>(ProfileService);
    // Limpia usuarios antes de cada test
    (service as any).users = [];
    (service as any).idCounter = 1;
  });

  it('should create a user', async () => {
    const dto = { name: 'Test', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const user = await service.create(dto as any);
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@mail.com');
  });

  it('should throw ConflictException if email exists', async () => {
    const dto = { name: 'Test', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    await service.create(dto as any);
    await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if profile not found', async () => {
    mockProfileService.findOne.mockRejectedValueOnce(new Error());
    const dto = { name: 'Test', email: 'test2@mail.com', age: 20, isActive: true, profileId: 'notfound' };
    await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
  });

  it('should find all users', async () => {
    const dto = { name: 'Test', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    await service.create(dto as any);
    const users = await service.findAll();
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty('profile');
  });

  it('should find one user', async () => {
    const dto = { name: 'Test', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const created = await service.create(dto as any);
    const user = await service.findOne(created.id);
    expect(user).toHaveProperty('profile');
  });

  it('should throw NotFoundException if user not found', async () => {
    await expect(service.findOne('notfound')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const dto = { name: 'Test', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const created = await service.create(dto as any);
    const updated = await service.update(created.id, { name: 'Updated' } as any);
    expect(updated.name).toBe('Updated');
  });

  it('should throw NotFoundException on update if user not found', async () => {
    await expect(service.update('notfound', { name: 'Updated' } as any)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException on update if email exists', async () => {
    const dto1 = { name: 'Test1', email: 'test1@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const dto2 = { name: 'Test2', email: 'test2@mail.com', age: 22, isActive: true, profileId: 'profile1' };
    const user1 = await service.create(dto1 as any);
    await service.create(dto2 as any);
    await expect(
      service.update(user1.id, { email: 'test2@mail.com' } as any)
    ).rejects.toThrow(ConflictException);
  });

  it('should remove a user', async () => {
    const dto = { name: 'Test', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const created = await service.create(dto as any);
    const removed = await service.remove(created.id);
    expect(removed.id).toBe(created.id);
  });

  it('should throw NotFoundException on remove if user not found', async () => {
    await expect(service.remove('notfound')).rejects.toThrow(NotFoundException);
  });
});