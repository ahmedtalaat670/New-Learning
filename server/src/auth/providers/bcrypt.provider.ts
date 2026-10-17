import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashingPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}
