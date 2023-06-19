import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { InternalServerErrorException } from '@/common/exceptions/internal-server-error.exception';
import { UserNotFoundException } from '@/common/exceptions/user-not-found.exception';
import { Usecase } from '@/common/types/usecase';
import { RoomResponseSchema } from '@/contract/rooms/room.response.dto';
import { InviteUserToRoomRequestDto } from '@/rooms/dtos/invite-user-to-room.request.dto';
import { RoomResponseDto } from '@/rooms/dtos/room.response.dto';
import { UserAlreadyInRoomException } from '@/rooms/exceptions/user-already-in-room.exception';
import { RoomsRepository } from '@/rooms/rooms.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InviteUserToRoomUsecase implements Usecase {
  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly clerkAuthUserProvider: ClerkAuthUserProvider
  ) {}

  async execute(
    userId: string,
    inviteUserToRoomRequestDto: InviteUserToRoomRequestDto
  ): Promise<RoomResponseDto> {
    const user = await this.clerkAuthUserProvider.findUser(
      inviteUserToRoomRequestDto.user
    );
    if (!user) {
      throw new UserNotFoundException();
    }

    const userRooms = await this.roomsRepository.findMyRooms(user.id);
    if (userRooms.find((room) => room.members.includes(user.id))) {
      throw new UserAlreadyInRoomException();
    }

    try {
      const room = await this.roomsRepository.inviteUserToRoom(
        user.id,
        inviteUserToRoomRequestDto.roomId
      );
      return RoomResponseSchema.parse(room);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
