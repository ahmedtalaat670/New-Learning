import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from './enums/user-roles.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 96,
  })
  name!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 96,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 96,
  })
  @Exclude()
  password!: string | null;

  @Column({
    type: 'enum',
    enum: UserRoles,
    nullable: false,
    default: UserRoles.USER,
  })
  role!: UserRoles;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 128,
    unique: true,
  })
  @Exclude()
  googleId!: string | null;
}
