import { UserResponseDto } from '@/auth/dtos/user.response.dto';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { UserResponseSchema } from '@/contract/auth/user.response.dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
@UseGuards(ClerkAuthGuard)
export class AuthController {
  constructor(private readonly clerkAuthUserProvider: ClerkAuthUserProvider) {}

  @Get('users')
  @ApiClerkAuthHeaders()
  @ApiQuery({
    name: 'userIds',
    isArray: true,
    type: String,
    description: 'List of user ids to fetch from auth provider',
  })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiOperation({ description: 'Get a list of users' })
  async findUsers(
    @Query('userIds')
    userIds: string[]
  ): Promise<UserResponseDto[]> {
    const userList = await this.clerkAuthUserProvider.findUsers(userIds);
    return userList.map((room) => UserResponseSchema.parse(room));
  }
}
