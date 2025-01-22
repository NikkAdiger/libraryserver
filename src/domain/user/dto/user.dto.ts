import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserStatus } from '../../../types/enums';

export class UserDto {
	@IsString()
	@IsOptional()
	firstName: string;

	@IsString()
	@IsOptional()
	lastName: string;

	@IsEnum(UserStatus)
	@IsOptional()
	status: UserStatus;

	@IsEmail()
	@IsOptional()
	email: string;

	// will be hashed before storage
	@IsString()
	@IsOptional()
	password: string;
}

export class CreateUserDto extends UserDto {
	@IsString()
	nikName: string;
}

export class UpdateUserDto extends UserDto {
	@IsString()
	id: string;

	@IsString()
	@IsOptional()
	nikName: string;
}