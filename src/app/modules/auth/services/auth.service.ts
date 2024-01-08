import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptHelper, EmailHelper } from '@src/app/helpers';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';
import { gen6digitOTP, identifyIdentifier } from '@src/shared';
import * as Crypto from 'crypto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { GlobalConfigService } from '../../globalConfig/services/globalConfig.service';
import { EmailService } from '../../notifications/email/email.service';
import { SmsService } from '../../notifications/sms/sms.service';
import { User } from '../../user/entities/user.entity';
import { UserRoleService } from '../../user/services/userRole.service';
import {
  LoginDTO,
  RefreshTokenDTO,
  RegisterDTO,
  ResetPasswordDTO,
  VerifyResetPasswordDTO,
} from '../dtos';
import { AccountVerifyRequestDTO } from '../dtos/accountVerifyRequest.dto';
import { Authenticate2faDTO } from '../dtos/authenticate2fa.dto';
import { GoogleAuthRequestDTO } from '../dtos/googleAuthRequest.dto';
import { ValidateDTO } from '../dtos/validate.dto';
import { VerifyAccountDTO } from '../dtos/verifyAccount.dto';
import { ENUM_AUTH_PROVIDERS } from '../enums';
import { JWTHelper } from './../../../helpers/jwt.helper';
import { UserRole } from './../../user/entities/userRole.entity';
import { UserService } from './../../user/services/user.service';
import { ChangePasswordDTO } from './../dtos/changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly jwtHelper: JWTHelper,
    private readonly bcryptHelper: BcryptHelper,
    private readonly http: HttpService,
    private readonly smsService: SmsService,
    private readonly emailHelper: EmailHelper,
    private readonly emailService: EmailService,
    private readonly globalConfigService: GlobalConfigService,
  ) {}

  async validateUserUsingIdentifierAndPassword(
    identifier: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findOne({
      where: {
        identifier,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.bcryptHelper.compareHash(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async accountVerifyRequest(payload: AccountVerifyRequestDTO) {
    const { identifier } = payload;
    const user = await this.userService.isExist({
      identifier,
    });
    // if (user?.isVerified) {
    //   throw new BadRequestException('Account Already Verified !!');
    // }

    const config = await this.globalConfigService.getConfigs();

    const otp = gen6digitOTP();
    const hash = this.jwtHelper.generateOtpHash(
      identifier,
      otp,
      config.otpExpiresInMin,
      ENV.jwt.secretForAccountVerification,
    );

    const identifierData = await identifyIdentifier(identifier, {});

    const sentTo = { identifier, isEmail: false, isPhoneNumber: false };
    if (identifierData?.email) {
      sentTo.isEmail = true;
    } else if (identifierData.phoneNumber) {
      sentTo.isPhoneNumber = true;
    } else if (identifierData.username) {
      if (user.email) {
        sentTo.identifier = user?.email;
        sentTo.isEmail = true;
      } else if (user.phoneNumber) {
        sentTo.identifier = user?.phoneNumber;
        sentTo.isPhoneNumber = true;
      }
    } else {
      throw new BadRequestException('Invalid Identifier!!');
    }
    if (sentTo.isEmail && !ENV.isProduction) {
      const emailContent = await this.emailHelper.createEmailContent(
        {
          name: user?.firstName || identifier,
          otp,
          supportEmail: ENV.policy.supportEmailAddress,
        },
        'account-verify',
      );
      this.emailService.sendEmail({
        to: sentTo.identifier,
        subject: 'Otp Verification',
        html: emailContent,
      });
    }
    if (sentTo.isPhoneNumber && !ENV.isProduction) {
      this.smsService.sendSms(
        sentTo.identifier,
        `Your OTP for account verification is ${otp} - UNICLIENT TECHNOLOGIES`,
      );
    }
    return new SuccessResponse(`OTP sent to ${sentTo.identifier}.`, {
      identifier: sentTo.identifier,
      hash,
      otp: ENV.isProduction ? null : otp,
    });
  }
  async verifyAccount(payload: VerifyAccountDTO): Promise<SuccessResponse> {
    const { identifier, otp, hash } = payload;
    const user = await this.userService.isExist({
      identifier,
    });

    const isOtpVerified = this.jwtHelper.verifyOtpHash(
      identifier,
      otp,
      hash,
      ENV.jwt.secretForAccountVerification,
    );

    if (!isOtpVerified) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.userService.save([
      {
        id: user.id,
        isVerified: true,
      },
    ]);

    return new SuccessResponse(`Account verified successfully. Please login`);
  }

  async resetPassword(payload: ResetPasswordDTO): Promise<SuccessResponse> {
    const { identifier } = payload;
    const user = await this.userService.isExist({
      identifier,
    });
    const config = await this.globalConfigService.getConfigs();

    const otp = gen6digitOTP();
    const hash = this.jwtHelper.generateOtpHash(
      identifier,
      otp,
      config.otpExpiresInMin,
      ENV.jwt.secretForResetPassword,
    );

    const identifierData = await identifyIdentifier(identifier, {});

    const sentTo = { identifier, isEmail: false, isPhoneNumber: false };
    if (identifierData?.email) {
      sentTo.isEmail = true;
    } else if (identifierData.phoneNumber) {
      sentTo.isPhoneNumber = true;
    } else if (identifierData.username) {
      if (user.email) {
        sentTo.identifier = user?.email;
        sentTo.isEmail = true;
      } else if (user.phoneNumber) {
        sentTo.identifier = user?.phoneNumber;
        sentTo.isPhoneNumber = true;
      }
    } else {
      throw new BadRequestException('Invalid Identifier!!');
    }
    if (sentTo.isEmail && !ENV.isProduction) {
      const emailContent = await this.emailHelper.createEmailContent(
        {
          name: user?.firstName || identifier,
          otp,
        },
        'reset-password',
      );
      this.emailService.sendEmail({
        to: sentTo.identifier,
        subject: 'Otp Verification',
        html: emailContent,
      });
    }
    if (sentTo.isPhoneNumber && !ENV.isProduction) {
      this.smsService.sendSms(
        sentTo.identifier,
        `Your OTP PIN for password reset: ${otp}
         Please use this PIN to reset your password.`,
      );
    }
    return new SuccessResponse(`OTP sent to ${sentTo.identifier}.`, {
      identifier: sentTo.identifier,
      hash,
      otp: ENV.isProduction ? null : otp,
    });
  }

  async verifyResetPassword(payload: VerifyResetPasswordDTO): Promise<SuccessResponse> {
    const { identifier, otp, newPassword, hash } = payload;
    const user = await this.userService.isExist({
      identifier,
    });

    const isOtpVerified = this.jwtHelper.verifyOtpHash(
      identifier,
      otp,
      hash,
      ENV.jwt.secretForResetPassword,
    );

    if (!isOtpVerified) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.userService.save([
      {
        id: user.id,
        password: newPassword,
      },
    ]);

    return new SuccessResponse(`Password reset successfully. Please login`);
  }

  async changePassword(payload: ChangePasswordDTO, authUser: IAuthUser): Promise<SuccessResponse> {
    const { oldPassword, newPassword } = payload;

    const isExist = await this.userService.findOne({
      where: { id: authUser.id as any },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'phoneNumber'],
    });

    if (!isExist) {
      throw new BadRequestException('User does not exists');
    }

    const isPasswordMatched = await this.bcryptHelper.compareHash(oldPassword, isExist.password);

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid old password');
    }

    await this.userService.save([
      {
        id: isExist.id,
        password: newPassword,
      },
    ]);

    return new SuccessResponse(`Password changed successfully. Please login`);
  }

  async registerUser(payload: RegisterDTO): Promise<SuccessResponse> {
    const user = await this.userService.registerUser(payload);
    return new SuccessResponse('User registered successfully. Please login', user);
  }

  async refreshToken(payload: RefreshTokenDTO): Promise<SuccessResponse> {
    const decoded = this.jwtHelper.verifyRefreshToken(payload.refreshToken);
    if (!decoded.user || !decoded.user.id) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.userService.findOne({
      where: {
        id: decoded.user.id,
      },
    });
    return this.loginResponse(user, 'Refresh token success');
  }

  async getUserRolePermissions(user: number | string): Promise<any> {
    const userRoles = (await this.userRoleService.findAllBase(
      {
        user: user as any,
      },
      {
        relations: ['role'],
        withoutPaginate: true,
      },
    )) as UserRole[];

    const roles = userRoles.map((uR) => uR.role.title);
    const permissions = await this.userRoleService.getUserPermissions(user);
    return {
      roles,
      permissions,
    };
  }

  async loginResponse(user: User, successMessage?: string): Promise<SuccessResponse> {
    const { roles, permissions } = await this.getUserRolePermissions(user?.id);

    const tokenPayload = {
      identifier: user.identifier,
      user: {
        id: user.id,
        identifier: user.identifier,
        roles,
        permissions,
      },
    };

    const refreshTokenPayload = {
      user: {
        id: user.id,
      },
      isRefreshToken: true,
    };

    const permissionTokenPayload = {
      permissions,
    };

    const token = this.jwtHelper.makeAccessToken(tokenPayload);
    const refreshToken = this.jwtHelper.makeRefreshToken(refreshTokenPayload);
    const permissionToken = this.jwtHelper.makePermissionToken(permissionTokenPayload);
    return new SuccessResponse(successMessage || 'Login success', {
      token,
      refreshToken,
      permissionToken,
      user: ENV.isProduction ? null : { ...tokenPayload.user },
    });
  }

  async loginUser(payload: LoginDTO): Promise<SuccessResponse> {
    const user = await this.userService.loginUser(payload);
    if (!user?.isVerified) {
      return new SuccessResponse('Account verification Required !!', {
        identifier: user?.identifier,
        isVerified: user?.isVerified,
      });
    }
    if (user?.isTwoFactorEnabled) {
      return new SuccessResponse('Two Factor Authentication Required !!', {
        identifier: user?.identifier,
        twoFactorEnabled: true,
      });
    }
    return this.loginResponse(user);
  }

  // async validate(payload: ValidateDTO): Promise<SuccessResponse> {
  //   const url = `${ENV.sso.endpoint}/auth/validate`;
  //   const responseData = await this.http.post(
  //     url,
  //     { token: payload.token },
  //     {
  //       headers: {
  //         'x-api-key': ENV.sso.apiKey,
  //         'x-api-secret': ENV.sso.apiSecret,
  //       },
  //     },
  //   );

  //   const response = await firstValueFrom(responseData);

  //   if (!response?.data || !response?.data?.success) {
  //     throw new BadRequestException('Invalid token');
  //   }

  //   const userData: IValidatedUser = response.data.data;

  //   const isUserExist = await this.userService.findOne({
  //     where: {
  //       email: userData.user.identifier,
  //     },
  //   });

  //   if (isUserExist) {
  //     await this.userService.repo.update(isUserExist.id, {
  //       firstName: userData.user.firstName,
  //       lastName: userData.user.lastName,
  //       email: userData.user.identifier,
  //       phoneNumber: userData.user.phoneNumber,
  //     });
  //   } else {
  //     await this.userService.repo.save({
  //       firstName: userData.user.firstName,
  //       lastName: userData.user.lastName,
  //       email: userData.user.identifier,
  //       phoneNumber: userData.user.phoneNumber,
  //     });
  //   }

  //   const user = await this.userService.findOne({
  //     where: {
  //       email: userData.user.identifier,
  //     },
  //   });

  //   const tokenPayload = {
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       roles: userData.roles,
  //       permissions: userData.permissions,
  //     },
  //   };

  //   const refreshTokenPayload = {
  //     user: {
  //       id: user.id,
  //     },
  //     isRefreshToken: true,
  //   };

  //   const token = this.jwtHelper.makeAccessToken(tokenPayload);
  //   const refreshToken = this.jwtHelper.makeRefreshToken(refreshTokenPayload);

  //   return new SuccessResponse('Login success', {
  //     token,
  //     refreshToken,
  //     user: ENV.isProduction ? null : { ...tokenPayload.user },
  //   });
  // }

  // async authRequest(redirectUrl: string) {
  //   try {
  //     const url = `${ENV.sso.endpoint}/auth/auth-request?redirectUrl=${redirectUrl}&apiKey=${ENV.sso.apiKey}&apiSecret=${ENV.sso.apiSecret}`;
  //     const responseData = await this.http.get(url, {
  //       headers: {
  //         'x-api-key': ENV.sso.apiKey,
  //         'x-api-secret': ENV.sso.apiSecret,
  //       },
  //     });

  //     const response = await firstValueFrom(responseData);
  //     return response?.data;
  //   } catch (error) {
  //     throw error?.response?.data || error;
  //   }
  // }

  async googleAuthRequest(query: GoogleAuthRequestDTO): Promise<string> {
    const { webRedirectUrl } = query;
    const state = JSON.stringify({ webRedirectUrl, provider: 'google' });
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const authorizationUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${ENV.google.clientId}` +
      `&redirect_uri=${ENV.google.redirectUrl}` +
      '&response_type=code' +
      '&scope=' +
      scopes.join(' ') +
      '&state=' +
      state;
    return authorizationUrl;
  }

  async googleLogin(
    userData: Record<string, any>,
    state: string,
  ): Promise<{
    callBackUrl: string;
  }> {
    if (!userData) {
      throw new BadRequestException('No user from google');
    }
    const additionalData = JSON.parse(state) as {
      webRedirectUrl: string;
      provider: string;
    };

    const isExist = await this.userService.findOne({
      where: { identifier: userData.email },
    });

    if (!isExist) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const newUserData: User = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          identifier: userData.email,
          email: userData.email,
          isOtpVerified: true,
          isOtpVerificationRequired: false,
          authProvider: ENUM_AUTH_PROVIDERS.GOOGLE,
          password: Crypto.randomBytes(20).toString('hex'),
          isVerified: true,
        };
        const createdUser = await queryRunner.manager.save(Object.assign(new User(), newUserData));

        if (!createdUser) {
          throw new BadRequestException('Cannot create user');
        }
        await queryRunner.commitTransaction();
        await queryRunner.release();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    }

    const newCreatedUser = await this.userService.findOne({
      where: { identifier: userData.email },
    });

    if (!newCreatedUser) {
      throw new BadRequestException('User not created');
    }

    const tokenData = {
      userId: newCreatedUser.id,
    };

    const token = await this.jwtHelper.makeAccessToken(tokenData);

    const callBackUrl = `${additionalData.webRedirectUrl}?token=${token}`;

    return {
      callBackUrl,
    };
  }

  async validate(payload: ValidateDTO): Promise<SuccessResponse> {
    // if (payload.provider === 'google') return this.validateUsingGoogleAuth(payload);
    return this.validateUsingSystemAuth(payload);
  }

  async validateUsingGoogleAuth(payload: ValidateDTO): Promise<SuccessResponse> {
    const googleUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${payload.token}`;

    const googleResponse = await this.http.get(googleUrl);
    const responseData = (await firstValueFrom(googleResponse)).data;

    const userData: User = {
      identifier: responseData.email,
      firstName: responseData.given_name,
      lastName: responseData.family_name,
      isOtpVerified: true,
      isOtpVerificationRequired: false,
      authProvider: ENUM_AUTH_PROVIDERS.GOOGLE,
    };

    const user = await this.userService.findOne({
      where: { identifier: userData.identifier },
    });

    if (!user) {
      await this.userService.saveOne(userData);
    } else {
      await this.userService.saveOne({
        id: user.id,
        ...userData,
      });
    }

    return new SuccessResponse('Validated successfully', responseData);
  }

  async validateUsingSystemAuth(payload: ValidateDTO): Promise<SuccessResponse> {
    const decodedToken = (await this.jwtHelper.verify(payload.token)) as {
      userId: number;
    };

    if (!decodedToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      where: { id: decodedToken.userId as any },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    if (user?.isTwoFactorEnabled) {
      return new SuccessResponse('Two Factor Authentication Required !!', {
        identifier: user?.identifier,
        twoFactorEnabled: true,
      });
    } else {
      return this.loginResponse(user, 'Validated success');
    }
  }

  async turnOn2fa(authUser: IAuthUser): Promise<SuccessResponse> {
    const user = await this.userService.findOne({
      where: { identifier: authUser.identifier },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isTwoFactorEnabled) {
      throw new BadRequestException('Two factor auth is already turned on');
    }

    const secret = authenticator.generateSecret();
    await this.userService.saveOne({
      id: user.id,
      twoFactorSecret: secret,
      isTwoFactorEnabled: true,
    });
    // TODO: Clear secret after 30 seconds

    const otpAuthUrl = authenticator.keyuri(
      user.identifier,
      ENV.authenticator.google.issuer,
      secret,
    );

    const qrCode = await toDataURL(otpAuthUrl);

    return new SuccessResponse('Two factor auth turned on', {
      qrCode,
    });
  }

  async turnOff2fa(authUser: IAuthUser): Promise<SuccessResponse> {
    const user = await this.userService.findOne({
      where: { identifier: authUser.identifier },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isTwoFactorEnabled) {
      throw new BadRequestException('Two factor auth is already turned off');
    }

    await this.userService.saveOne({
      id: user.id,
      twoFactorSecret: null,
      isTwoFactorEnabled: false,
    });

    return new SuccessResponse('Two factor auth turned off');
  }

  async authenticate2fa(payload: Authenticate2faDTO): Promise<SuccessResponse> {
    const user = await this.userService.findOne({
      where: { identifier: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const verifiedUser = authenticator.verify({
      token: payload.code,
      secret: user.twoFactorSecret,
    });

    if (!verifiedUser) {
      throw new UnauthorizedException('Invalid code');
    }
    return this.loginResponse(user, 'Two factor verified');
  }
}
