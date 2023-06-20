import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { UserNotFoundExceptionSchema } from '@/common/exceptions/user-not-found.exception';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { InviteUserToRoomRequestDto } from '@/rooms/dtos/invite-user-to-room.request.dto';
import { LeaveRoomRequestDto } from '@/rooms/dtos/leave-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { DuplicateRoomNameExceptionSchema } from '@/rooms/exceptions/duplicate-room-name.exception';
import { OwnerCannotLeaveRoomExceptionSchema } from '@/rooms/exceptions/owner-cannot-leave-room.exception';
import { OwnerMustBeLoggedExceptionSchema } from '@/rooms/exceptions/owner-must-be-logged.exception';
import { RoomNotFoundExceptionSchema } from '@/rooms/exceptions/room-not-found.exception';
import { UserAlreadyInRoomExceptionSchema } from '@/rooms/exceptions/user-already-in-room.exception';
import { FindMyRoomsUsecase } from '@/rooms/usecases/find-my-rooms.usecase';
import { FindPublicRoomsUsecase } from '@/rooms/usecases/find-public-rooms.usecase';
import { InviteUserToRoomUsecase } from '@/rooms/usecases/invite-user-to-room.usecase';
import { LeaveRoomUsecase } from '@/rooms/usecases/leave-room.usecase';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
    private readonly createRoomUsecase: CreateRoomUsecase,
    private readonly inviteUserToRoomUsecase: InviteUserToRoomUsecase,
    private readonly leaveRoomUsecase: LeaveRoomUsecase
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
  @ApiBadRequestResponse({ schema: OwnerMustBeLoggedExceptionSchema })
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

  @Post('invite')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto })
  @ApiNotFoundResponse({ schema: UserNotFoundExceptionSchema })
  @ApiBadRequestResponse({ schema: UserAlreadyInRoomExceptionSchema })
  @ApiOperation({ description: 'Invite a user to a room' })
  inviteUserToRoom(
    @Request() req: Request,
    @Body() inviteUserToRoomRequestDto: InviteUserToRoomRequestDto
  ): Promise<RoomResponseDto> {
    return this.inviteUserToRoomUsecase.execute(
      req.auth.userId,
      inviteUserToRoomRequestDto
    );
  }

  @Post('leave')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto })
  @ApiNotFoundResponse({ schema: RoomNotFoundExceptionSchema })
  @ApiBadRequestResponse({ schema: OwnerCannotLeaveRoomExceptionSchema })
  @ApiOperation({ description: 'Leave a room' })
  leaveRoom(
    @Request() req: Request,
    @Body() leaveRoomRequestDto: LeaveRoomRequestDto
  ): Promise<RoomResponseDto> {
    return this.leaveRoomUsecase.execute(req.auth.userId, leaveRoomRequestDto);
  }
}
