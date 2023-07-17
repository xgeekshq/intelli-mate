import { SuperAdminValidateCredentialsRequestDto } from '@/auth/dtos/super-admin-validate-credentials.request.dto';
import { UserNotSuperAdminException } from '@/auth/exceptions/user-not-super-admin.exception';
import { Usecase } from '@/common/types/usecase';
import { hashPassword } from '@/common/utils/hash-password';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminValidateCredentialsUsecase implements Usecase {
  constructor(private readonly configService: ConfigService) {}

  async execute(
    superAdminLoginRequestDto: SuperAdminValidateCredentialsRequestDto
  ): Promise<void> {
    const superAdminEmail = this.configService.get('SUPER_ADMIN_EMAIL');
    const superAdminPassword = hashPassword(
      this.configService.get('SUPER_ADMIN_PASSWORD')
    );
    let hashedPassword = superAdminLoginRequestDto.password;

    // FIXME: temporary check to see if it's already hashed
    //   could be done in a separate usecase to keep things clearer
    if (hashedPassword.length !== 44) {
      hashedPassword = hashPassword(hashedPassword);
    }

    if (
      hashedPassword !== superAdminPassword ||
      superAdminLoginRequestDto.email !== superAdminEmail
    ) {
      throw new UserNotSuperAdminException();
    }
  }
}
