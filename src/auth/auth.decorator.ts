import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);

export const Auth = () => SetMetadata('isNeedAuth', true);
