import { Test, TestingModule } from '@nestjs/testing';
import { BcryptProvider } from './bcrypt.provider';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('BcryptProvider', () => {
  let provider: BcryptProvider;

  const mockedGenSalt = bcrypt.genSalt as jest.MockedFunction<
    typeof bcrypt.genSalt
  >;
  const mockedHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
  const mockedCompare = bcrypt.compare as jest.MockedFunction<
    typeof bcrypt.compare
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptProvider],
    }).compile();

    provider = module.get<BcryptProvider>(BcryptProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('hashingPassword', () => {
    it('should generate a salt and hash the password correctly', async () => {
      const password = 'my-secure-password';
      const mockSalt = '$2b$10$completelyMockedSaltString';
      const mockHashedValue = '$2b$10$hashedPasswordOutputValue';

      mockedGenSalt.mockResolvedValue(mockSalt as never);
      mockedHash.mockResolvedValue(mockHashedValue as never);

      const result = await provider.hashingPassword(password);

      expect(mockedGenSalt).toHaveBeenCalledTimes(1);
      expect(mockedHash).toHaveBeenCalledWith(password, mockSalt);
      expect(result).toBe(mockHashedValue);
    });
  });

  describe('comparePassword', () => {
    it('should return true when bcrypt.compare resolves to true', async () => {
      const password = 'my-secure-password';
      const encryptedPassword = '$2b$10$hashedPasswordOutputValue';

      mockedCompare.mockResolvedValue(true as never);

      const result = await provider.comparePassword(
        password,
        encryptedPassword,
      );

      expect(mockedCompare).toHaveBeenCalledWith(password, encryptedPassword);
      expect(result).toBe(true);
    });

    it('should return false when bcrypt.compare resolves to false', async () => {
      const password = 'wrong-password';
      const encryptedPassword = '$2b$10$hashedPasswordOutputValue';

      mockedCompare.mockResolvedValue(false as never);

      const result = await provider.comparePassword(
        password,
        encryptedPassword,
      );

      expect(mockedCompare).toHaveBeenCalledWith(password, encryptedPassword);
      expect(result).toBe(false);
    });
  });
});
