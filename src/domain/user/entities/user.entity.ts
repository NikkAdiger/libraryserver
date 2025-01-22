import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
  } from 'typeorm';
import { BookUserEntity } from '../../book/entities/bookUser.entity';
import { UserStatus } from '../../../types/enums';

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', name: 'nik_name', unique: true })
	nikName: string;

	@Column({ type: 'varchar', name: 'first_name', nullable: true })
	firstName: string;

	@Column({ type: 'varchar', name: 'last_name', nullable: true })
	lastName: string;

	@Column({ type: 'varchar', nullable: true, select: false })
	password: string;

	@Column({ type: 'varchar', nullable: true })
	email: string;

	@Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE, nullable: true })
	status: UserStatus;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
