import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Role } from './enums/role.enum';

describe('ProfileService', () => {
  let service: ProfileService;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    usersService = module.get<UsersService>(UsersService);

    // Limpia perfiles antes de cada test
    (service as any).profiles = [];
    (service as any).idCounter = 1;
  });

  it('should create a profile', async () => {
    const dto = { profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER };
    const profile = await service.create(dto as any);
    expect(profile).toHaveProperty('id');
    expect(profile.profileName).toBe('Test');
  });

  it('should return all profiles', async () => {
    await service.create({ profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER } as any);
    const profiles = await service.findAll();
    expect(profiles.length).toBe(1);
  });

  it('should find a profile by id', async () => {
    const created = await service.create({ profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER } as any);
    const profile = await service.findOne(created.id);
    expect(profile.profileName).toBe('Test');
  });

  it('should throw NotFoundException if profile not found', async () => {
    await expect(service.findOne('notfound')).rejects.toThrow(NotFoundException);
  });

  it('should update a profile', async () => {
    const created = await service.create({ profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER } as any);
    const updated = await service.update(created.id, { profileName: 'Updated' } as any);
    expect(updated.profileName).toBe('Updated');
  });

  it('should throw NotFoundException on update if profile not found', async () => {
    await expect(service.update('notfound', { profileName: 'Updated' } as any)).rejects.toThrow(NotFoundException);
  });

  it('should remove a profile if not assigned to any user', async () => {
    const created = await service.create({ profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER } as any);
    mockUsersService.findAll.mockResolvedValueOnce([]); // No users with this profile
    const removed = await service.remove(created.id);
    expect(removed.id).toBe(created.id);
  });

  it('should throw NotFoundException on remove if profile not found', async () => {
    await expect(service.remove('notfound')).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if profile is assigned to a user', async () => {
    const created = await service.create({ profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER } as any);
    // Simula un usuario con este perfil
    mockUsersService.findAll.mockResolvedValueOnce([
      { id: 'user1', profile: { id: created.id } }
    ]);
    await expect(service.remove(created.id)).rejects.toThrow(ConflictException);
  });
});