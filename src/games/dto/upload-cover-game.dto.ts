import { ApiProperty } from '@nestjs/swagger';

export class UploadCoverGameDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
