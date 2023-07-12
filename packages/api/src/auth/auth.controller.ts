import { UserResponseDto } from '@/auth/dtos/user.response.dto';
import { ClerkAuthGuard } from '@/auth/guards/clerk/clerk.auth.guard';
import { ApiClerkAuthHeaders } from '@/auth/guards/clerk/open-api-clerk-headers.decorator';
import { ClerkAuthUserProvider } from '@/auth/providers/clerk/clerk-auth-user.provider';
import { UserResponseSchema } from '@/contract/auth/user.response.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private readonly clerkAuthUserProvider: ClerkAuthUserProvider) {}

  @Post('integrations/clerk/new-user')
  @ApiOperation({ description: 'Clerk integration for new users' })
  async clerkNewUserIntegration(
    @Body() userCreatedEvent: { data: { id: string } }
  ): Promise<void> {
    console.log(userCreatedEvent);
    console.log(userCreatedEvent.data.id);
    void this.clerkAuthUserProvider.assignDefaultRoleToUser(
      userCreatedEvent.data.id
    );
  }

  @Get('users/:id')
  @UseGuards(ClerkAuthGuard)
  @ApiClerkAuthHeaders()
  @ApiOkResponse({ type: UserResponseDto })
  @ApiOperation({ description: 'Get a single user' })
  async findUser(@Param('id') userId: string): Promise<UserResponseDto> {
    const user = await this.clerkAuthUserProvider.findUser(userId);
    return UserResponseSchema.parse(user);
  }

  @Get('users')
  @UseGuards(ClerkAuthGuard)
  @ApiClerkAuthHeaders()
  @ApiQuery({
    name: 'userIds',
    isArray: true,
    type: String,
    description: 'List of user ids to fetch from auth provider',
    required: false,
  })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ApiOperation({
    description:
      'Get a list of users. If id list is specified, it fetches all from that array. If no query param is sent, it fetches all users.',
  })
  async findUsers(
    @Query('userIds')
    userIds: string[]
  ): Promise<UserResponseDto[]> {
    const userList = await this.clerkAuthUserProvider.findUsers(userIds);
    return userList.map((user) => UserResponseSchema.parse(user));
  }
}
