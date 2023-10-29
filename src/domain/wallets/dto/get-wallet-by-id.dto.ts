import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  id: string;
}

export class Data {
  @ApiProperty()
  user: User;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  previous_balance: number;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  id: string;
}

export class GetWalletByIdDto {
  @ApiProperty()
  data: Data;

  @ApiProperty()
  message: string;
}
