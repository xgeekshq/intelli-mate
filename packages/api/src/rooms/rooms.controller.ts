import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import {
  DuplicateRoomNameException,
  DuplicateRoomNameExceptionSchema,
} from '@/rooms/exceptions/duplicate-room-name.exception';
import { FindMyRoomsUsecase } from '@/rooms/usecases/find-my-rooms.usecase';
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
  ApiConflictResponse,
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
    private readonly findPublicRoomsUsecase: FindPublicRoomsUsecase,
    private readonly findMyRoomsUsecase: FindMyRoomsUsecase,
    private readonly createRoomUsecase: CreateRoomUsecase
  ) {}

  @Get('public')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto, isArray: true })
  @ApiOperation({ description: 'List all public rooms' })
  findPublicRooms(@Request() req: Request): Promise<RoomResponseDto[]> {
    return this.findPublicRoomsUsecase.execute(req.auth.userId);
  }

  @Get('my')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto, isArray: true })
  @ApiOperation({ description: 'List my rooms' })
  findMyRooms(@Request() req: Request): Promise<RoomResponseDto[]> {
    return this.findMyRoomsUsecase.execute(req.auth.userId);
  }

  @Post()
  @ApiClerkAuthHeaders()
  @ApiCreatedResponse({ type: RoomResponseDto })
  @ApiConflictResponse({ schema: DuplicateRoomNameExceptionSchema })
  @ApiOperation({ description: 'Create a new room' })
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
