import { Body, Controller, Inject, ParseIntPipe, Post } from '@nestjs/common';
import { OrdersService } from './providers/orders.service';
import { User } from 'src/auth/decorators/active-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject()
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Generates a purchase order process for a specific target course asset.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'integer',
          description:
            'The unique numeric tracking identifier of the course being purchased',
          example: 101,
        },
      },
      required: ['courseId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order tracking log record instantiated cleanly.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Payload validation criteria failed or course parsing malfunctioned.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication token is invalid or expired.',
  })
  @ApiResponse({
    status: 404,
    description: 'The requested courseId was not found in the catalog.',
  })
  public create(
    @Body('courseId', ParseIntPipe) courseId: number,
    @User('sub') sub: string,
  ) {
    return this.ordersService.create(courseId, sub);
  }
}
