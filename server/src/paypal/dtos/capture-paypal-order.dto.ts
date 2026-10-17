import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CapturePaypalOrderDto {
  @ApiProperty({
    description:
      'The unique numeric identifier of the order inside the database',
    type: Number,
    example: 1042,
  })
  @IsInt()
  @IsNotEmpty()
  orderId!: number;

  @ApiProperty({
    description:
      'The order token or capture ID generated and returned by PayPal',
    type: String,
    example: '5O404320TB704654L',
  })
  @IsString()
  @IsNotEmpty()
  paypalOrderId!: string;
}
