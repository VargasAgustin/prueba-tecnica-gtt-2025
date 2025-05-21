import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ForbiddenException } from '@nestjs/common';
import { Role } from './enums/role.enum';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const adminProfile = { role: Role.ADMIN };
  const userProfile = { role: Role.USER };

  const mockProfileService = {
    create: jest.fn().mockResolvedValue({ id: '1', profileName: 'Test' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', profileName: 'Test' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', profileName: 'Test' }),
    update: jest.fn().mockResolvedValue({ id: '1', profileName: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ id: '1', profileName: 'Deleted' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should create a profile if admin', async () => {
    const dto = { profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER };
    const req = { profile: adminProfile } as any;
    await expect(controller.create(dto as any, req)).resolves.toEqual({ id: '1', profileName: 'Test' });
  });

  it('should throw ForbiddenException if not admin on create', async () => {
    const dto = { profileName: 'Test', code: 'CODE', isActive: true, role: Role.USER };
    const req = { profile: userProfile } as any;
    await expect(controller.create(dto as any, req)).rejects.toThrow(ForbiddenException);
  });

  it('should return all profiles if authenticated', async () => {
    const req = { profile: userProfile } as any;
    await expect(controller.findAll(req)).resolves.toEqual([{ id: '1', profileName: 'Test' }]);
  });

  it('should throw ForbiddenException if not authenticated on findAll', async () => {
    const req = {} as any;
    await expect(controller.findAll(req)).rejects.toThrow(ForbiddenException);
  });

  it('should return a profile by id if authenticated', async () => {
    const req = { profile: userProfile } as any;
    await expect(controller.findOne('1', req)).resolves.toEqual({ id: '1', profileName: 'Test' });
  });

  it('should throw ForbiddenException if not authenticated on findOne', async () => {
    const req = {} as any;
    await expect(controller.findOne('1', req)).rejects.toThrow(ForbiddenException);
  });

  it('should update a profile if admin', async () => {
    const req = { profile: adminProfile } as any;
    const dto = { profileName: 'Updated' };
    await expect(controller.update('1', dto as any, req)).resolves.toEqual({ id: '1', profileName: 'Updated' });
  });

  it('should throw ForbiddenException if not admin on update', async () => {
    const req = { profile: userProfile } as any;
    const dto = { profileName: 'Updated' };
    await expect(controller.update('1', dto as any, req)).rejects.toThrow(ForbiddenException);
  });

  it('should remove a profile if admin', async () => {
    const req = { profile: adminProfile } as any;
    await expect(controller.remove('1', req)).resolves.toEqual({ id: '1', profileName: 'Deleted' });
  });

  it('should throw ForbiddenException if not admin on remove', async () => {
    const req = { profile: userProfile } as any;
    await expect(controller.remove('1', req)).rejects.toThrow(ForbiddenException);
  });
});
