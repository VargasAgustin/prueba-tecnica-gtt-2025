import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException } from '@nestjs/common';
import { Role } from 'src/profiles/enums/role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const adminProfile = { role: Role.ADMIN };
  const userProfile = { role: Role.USER };

  const mockUsersService = {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test User' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated User' }),
    remove: jest.fn().mockResolvedValue({ id: '1', name: 'Deleted User' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user if admin', async () => {
    const dto = { name: 'Test User', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const req = { profile: adminProfile } as any;
    await expect(controller.create(dto as any, req)).resolves.toEqual({ id: '1', name: 'Test User' });
  });

  it('should throw ForbiddenException if not admin on create', async () => {
    const dto = { name: 'Test User', email: 'test@mail.com', age: 20, isActive: true, profileId: 'profile1' };
    const req = { profile: userProfile } as any;
    await expect(controller.create(dto as any, req)).rejects.toThrow(ForbiddenException);
  });

  it('should return all users if authenticated', async () => {
    const req = { profile: userProfile } as any;
    await expect(controller.findAll(req)).resolves.toEqual([{ id: '1', name: 'Test User' }]);
  });

  it('should throw ForbiddenException if not authenticated on findAll', async () => {
    const req = {} as any;
    await expect(controller.findAll(req)).rejects.toThrow(ForbiddenException);
  });

  it('should return a user by id if authenticated', async () => {
    const req = { profile: userProfile } as any;
    await expect(controller.findOne('1', req)).resolves.toEqual({ id: '1', name: 'Test User' });
  });

  it('should throw ForbiddenException if not authenticated on findOne', async () => {
    const req = {} as any;
    await expect(controller.findOne('1', req)).rejects.toThrow(ForbiddenException);
  });

  it('should update a user if admin', async () => {
    const req = { profile: adminProfile } as any;
    const dto = { name: 'Updated User' };
    await expect(controller.update('1', dto as any, req)).resolves.toEqual({ id: '1', name: 'Updated User' });
  });

  it('should throw ForbiddenException if not admin on update', async () => {
    const req = { profile: userProfile } as any;
    const dto = { name: 'Updated User' };
    await expect(controller.update('1', dto as any, req)).rejects.toThrow(ForbiddenException);
  });

  it('should remove a user if admin', async () => {
    const req = { profile: adminProfile } as any;
    await expect(controller.remove('1', req)).resolves.toEqual({ id: '1', name: 'Deleted User' });
  });

  it('should throw ForbiddenException if not admin on remove', async () => {
    const req = { profile: userProfile } as any;
    await expect(controller.remove('1', req)).rejects.toThrow(ForbiddenException);
  });
});