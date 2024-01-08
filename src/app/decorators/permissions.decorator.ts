import { SetMetadata } from '@nestjs/common';

export const PermissionChecker = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
