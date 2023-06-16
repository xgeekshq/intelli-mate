import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { FindPublicRoomsUsecase } from '@/rooms/usecases/find-public-rooms.usecase';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateRoomUsecase } from './usecases/create-room.usecase';

@Controller({
  path: 'rooms',
  version: '1',
})
@ApiTags('rooms')
@UseGuards(ClerkAuthGuard)
export class RoomsController {
  constructor(
    private readonly listPublicRoomsUsecase: FindPublicRoomsUsecase,
    private readonly createRoomUsecase: CreateRoomUsecase
  ) {}

  @Get('public')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto, isArray: true })
  @ApiOperation({ description: 'List all public rooms' })
  @UseGuards(ClerkAuthGuard)
  findPublicRooms(@Request() req: Request): Promise<RoomResponseDto[]> {
    return this.listPublicRoomsUsecase.execute(req.auth.userId);
  }

  @Post()
  @ApiClerkAuthHeaders()
  @ApiCreatedResponse({ type: RoomResponseDto })
  @ApiOperation({ description: 'Create a new room' })
  @UseGuards(ClerkAuthGuard)
  createRoom(
    @Request() req: Request,
    @Body() createRoomRequestDto: CreateRoomRequestDto
  ): Promise<RoomResponseDto> {
    return this.createRoomUsecase.execute(
      req.auth.userId,
      createRoomRequestDto
    );
  }
}
