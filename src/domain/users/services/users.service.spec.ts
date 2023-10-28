import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getMockUser } from '../controllers/users.controller.spec';
import { User, UserDocument } from '../entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fail when there is an existing user', async () => {
    // GIVEN
    const mockUser = getMockUser();
    jest.spyOn(mockUserModel, 'findOne').mockReturnValue(mockUser as any);

    try {
      // WHEN
      await service.create(mockUser);
      expect(true).toBe(false);
    } catch (error) {
      // THEN
      expect(error.message).toBe('User with email already exist');
    }
  });

  it('should create a new user', async () => {
    // GIVEN
    const mockUser = getMockUser();
    jest.spyOn(mockUserModel, 'findOne').mockReturnValue(null);
    jest.spyOn(mockUserModel, 'create').mockReturnValue(mockUser as any);

    // WHEN
    const response = await service.create(mockUser);
    expect(response.message).toBe('User created successfully');
    expect(response.data.first_name).toBe(mockUser.first_name);
    expect(response.data.last_name).toBe(mockUser.last_name);
    expect(response.data.dob).toBe(mockUser.dob);
    expect(response.data.email).toBe(mockUser.email);
    expect(response.data.phone_number).toBe(mockUser.phone_number);
  });

  it('should fail when saving throws an error', async () => {
    // GIVEN
    const mockUser = getMockUser();
    jest.spyOn(mockUserModel, 'findOne').mockReturnValue(null);
    jest
      .spyOn(mockUserModel, 'create')
      .mockRejectedValue(new Error('Something went wrong'));

    try {
      // WHEN
      await service.create(mockUser);
      expect(true).toBe(false);
    } catch (error) {
      // THEN
      expect(error.message).toBe('Unknown error');
    }
  });
});
