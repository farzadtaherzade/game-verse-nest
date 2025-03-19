import { ApiProperty } from '@nestjs/swagger';

export class UploadCoverGameDto {
  @ApiProperty({ name: 'file', type: 'string', format: 'binary' })
  file: any;
}
