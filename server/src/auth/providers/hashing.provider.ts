import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashingPassword(password: string): Promise<string>;
  abstract comparePassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean>;
}
