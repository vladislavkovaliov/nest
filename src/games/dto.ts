import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({ example: 'Days gone 2', description: 'Game name.' })
  name: string;
}

export class UpdateGameDto extends PartialType(CreateGameDto) {}

export class GameDto {
  @ApiProperty({ example: 'Days gone 2', description: 'Game name.' })
  name: string;
}
