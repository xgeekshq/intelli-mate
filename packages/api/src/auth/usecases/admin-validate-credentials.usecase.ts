import { SuperAdminLoginRequestDto } from '@/auth/dtos/super-admin-login.request.dto';
import { UserNotSuperAdminException } from '@/auth/exceptions/user-not-super-admin.exception';
import { Usecase } from '@/common/types/usecase';
import { hashPassword } from '@/common/utils/hash-password';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminValidateCredentialsUsecase implements Usecase {
  constructor(private readonly configService: ConfigService) {}

  async execute(
    superAdminLoginRequestDto: SuperAdminLoginRequestDto
  ): Promise<void> {
    const superAdminEmail = this.configService.get('SUPER_ADMIN_EMAIL');
    const superAdminPassword = hashPassword(
      this.configService.get('SUPER_ADMIN_PASSWORD')
    );

    const hashedPassword = hashPassword(superAdminLoginRequestDto.password);

    if (
      hashedPassword !== superAdminPassword ||
      superAdminLoginRequestDto.email !== superAdminEmail
    ) {
      throw new UserNotSuperAdminException();
    }
  }
}
