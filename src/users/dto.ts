import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoUser {
  @ApiProperty({ example: 'Jonh', description: 'User login.' })
  login: string;

  @ApiProperty({ example: 'password', description: 'User password.' })
  password: string;
}

export class UserDto {
  @ApiProperty({ example: 'Jonh', description: 'User login.' })
  login: string;
}
