import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsAlpha,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements IUser {
  @ApiProperty({ required: true })
  @IsAlpha()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  first_name: string;

  @ApiProperty({ required: true })
  @IsAlpha()
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(11)
  @IsNumberString()
  phone_number: string;

  @ApiProperty({ required: true })
  @IsDateString()
  @IsNotEmpty()
  dob: Date;
}

export class ResponseUser {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  dob: Date;
}

export class CreateUserResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: ResponseUser;
}
