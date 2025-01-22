import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserStatus } from '../../../types/enums';

@Entity('user')
export class UserEntity {
	@PrimaryColumn({ type: 'varchar', default: uuid() })
	id: string;

	@Column({ type: 'varchar', name: 'user_name', unique: true })
	userName: string;

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
