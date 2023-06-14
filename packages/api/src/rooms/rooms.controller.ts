import { ClerkAuthGuard } from '@/auth/guards/clerk.auth.guard';
import { CreateRoomRequestDto } from '@/types/rooms/create-room.request.dto';
import { RoomResponseDto } from '@/types/rooms/room.response.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { CreateRoomUsecase } from './usecases/create-room.usecase';

@Controller('rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly createRoomUsecase: CreateRoomUsecase) {}

  @Post()
  @ApiCreatedResponse({ type: RoomResponseDto })
  @UseGuards(ClerkAuthGuard)
  createRoom(
    @Body() createRoomRequestDto: CreateRoomRequestDto
  ): Promise<RoomResponseDto> {
    return this.createRoomUsecase.execute(createRoomRequestDto);
  }
}
