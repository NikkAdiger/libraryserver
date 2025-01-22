import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Unique,
  } from 'typeorm';
import { BookStatus } from '../../../types/enums';

@Entity('book')
@Unique(['title', 'author'])
export class BookEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'varchar' })
	author: string;

	@Column({ type: 'int', nullable: true })
	year: number;

	@Column({ type: 'varchar', nullable: true })
	genre: string;

	@Column({ type: 'enum', enum: BookStatus, nullable: true })
	status: BookStatus;

	@Column({ type: 'int', name: 'average_rating', nullable: true, default: null })
	averageRating: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
