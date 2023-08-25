import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { UserNotFoundExceptionSchema } from '@/common/exceptions/user-not-found.exception';
import { CreateRoomRequestDto } from '@/rooms/dtos/create-room.request.dto';
import { InviteUserToRoomRequestDto } from '@/rooms/dtos/invite-user-to-room.request.dto';
import { JoinRoomRequestDto } from '@/rooms/dtos/join-room.request.dto';
import { LeaveRoomRequestDto } from '@/rooms/dtos/leave-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { UpdateRoomSettingsRequestDto } from '@/rooms/dtos/update-room-settings.request.dto';
import { DuplicateRoomNameExceptionSchema } from '@/rooms/exceptions/duplicate-room-name.exception';
import { NoRoomSettingsDefinedExceptionSchema } from '@/rooms/exceptions/no-room-settings-defined.exception';
import { NotRoomOwnerExceptionSchema } from '@/rooms/exceptions/not-room-owner.exception';
import { OwnerCannotLeaveRoomExceptionSchema } from '@/rooms/exceptions/owner-cannot-leave-room.exception';
import { OwnerMustBeLoggedExceptionSchema } from '@/rooms/exceptions/owner-must-be-logged.exception';
import { RoomIsPrivateExceptionSchema } from '@/rooms/exceptions/room-is-private.exception';
import { RoomMustBeEmptyToDeleteExceptionSchema } from '@/rooms/exceptions/room-must-be-empty-to-delete.exception';
import { RoomNotFoundExceptionSchema } from '@/rooms/exceptions/room-not-found.exception';
import { UserAlreadyInRoomExceptionSchema } from '@/rooms/exceptions/user-already-in-room.exception';
import { UserNotRoomMemberExceptionSchema } from '@/rooms/exceptions/user-not-room-member.exception';
import { DeleteRoomUsecase } from '@/rooms/usecases/delete-room.usecase';
import { FindMyRoomsUsecase } from '@/rooms/usecases/find-my-rooms.usecase';
import { FindPublicRoomsUsecase } from '@/rooms/usecases/find-public-rooms.usecase';
import { FindRoomUsecase } from '@/rooms/usecases/find-room.usecase';
import { InviteUserToRoomUsecase } from '@/rooms/usecases/invite-user-to-room.usecase';
import { JoinRoomUsecase } from '@/rooms/usecases/join-room.usecase';
import { LeaveRoomUsecase } from '@/rooms/usecases/leave-room.usecase';
import { UpdateRoomSettingsUsecase } from '@/rooms/usecases/update-room-settings.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
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
    private readonly leaveRoomUsecase: LeaveRoomUsecase,
    private readonly updateRoomSettingsUsecase: UpdateRoomSettingsUsecase,
    private readonly findRoomUsecase: FindRoomUsecase,
    private readonly joinRoomUsecase: JoinRoomUsecase,
    private readonly deleteRoomUsecase: DeleteRoomUsecase
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

  @Get('/:id')
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto })
  @ApiNotFoundResponse({ schema: RoomNotFoundExceptionSchema })
  @ApiBadRequestResponse({ schema: UserNotRoomMemberExceptionSchema })
  @ApiOperation({ description: 'Get a single room by id' })
  async findRoomById(
    @Request() req: Request,
    @Param('id') id: string
  ): Promise<RoomResponseDto> {
    return this.findRoomUsecase.execute(req.auth.userId, id);
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
  @HttpCode(HttpStatus.OK)
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

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto })
  @ApiNotFoundResponse({ schema: RoomNotFoundExceptionSchema })
  @ApiForbiddenResponse({ schema: RoomIsPrivateExceptionSchema })
  @ApiBadRequestResponse({ schema: UserAlreadyInRoomExceptionSchema })
  @ApiOperation({ description: 'Join a public room' })
  joinRoom(
    @Request() req: Request,
    @Body() joinRoomRequestDto: JoinRoomRequestDto
  ): Promise<RoomResponseDto> {
    return this.joinRoomUsecase.execute(req.auth.userId, joinRoomRequestDto);
  }

  @Post('leave')
  @HttpCode(HttpStatus.OK)
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

  @Patch('settings/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: RoomResponseDto })
  @ApiBadRequestResponse({ schema: NoRoomSettingsDefinedExceptionSchema })
  @ApiConflictResponse({ schema: DuplicateRoomNameExceptionSchema })
  @ApiForbiddenResponse({ schema: NotRoomOwnerExceptionSchema })
  @ApiOperation({ description: 'Update room settings' })
  updateRoomSettings(
    @Request() req: Request,
    @Param('id') roomId: string,
    @Body() updateRoomSettingsRequestDto: UpdateRoomSettingsRequestDto
  ): Promise<RoomResponseDto> {
    return this.updateRoomSettingsUsecase.execute(
      req.auth.userId,
      roomId,
      updateRoomSettingsRequestDto
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiClerkAuthHeaders()
  @ApiNoContentResponse({ description: 'No content' })
  @ApiBadRequestResponse({ schema: RoomMustBeEmptyToDeleteExceptionSchema })
  @ApiForbiddenResponse({ schema: NotRoomOwnerExceptionSchema })
  @ApiNotFoundResponse({ schema: RoomNotFoundExceptionSchema })
  @ApiOperation({ description: 'Delete room' })
  deleteRoom(
    @Request() req: Request,
    @Param('id') roomId: string
  ): Promise<void> {
    return this.deleteRoomUsecase.execute(req.auth.userId, roomId);
  }
}
