import {
	Entity,
	PrimaryGeneratedColumn,
	Unique,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
  } from 'typeorm';

@Entity('book_user')
@Unique(['bookId', 'userId'])
export class BookUserEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ name: 'book_id' })
	bookId: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ type: 'int', name: 'user_rating', nullable: true })
	userRating: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
