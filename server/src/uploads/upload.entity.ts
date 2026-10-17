import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { fileTypes } from './enums/file-types.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name!: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path!: string;

  @Column({
    type: 'enum',
    enum: fileTypes,
    default: fileTypes.IMAGE,
    nullable: false,
  })
  type!: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  mime!: string;

  @Column({
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  size!: number;

  @CreateDateColumn()
  @Exclude()
  createDate!: Date;

  @UpdateDateColumn()
  @Exclude()
  updateDate!: Date;
}
