import { UserDto } from 'src/user/dto/user.dto';

export const emailVerifyMessage = (url: string, user: UserDto): string[] => {
  return [
    `Welcome to our FE Camp Family, N. ${user.profile.firstName} ${user.profile.lastName}<br/>`,
    `the next step is you need to verify your email address.<br/>`,
    `please click this link ${url} <br/>`,
  ];
};

export const resetPasswordMessage = (url: string, expireDate: string): string[] => {
  return [
    `You are receiving this email because you have requested a password reset.<br/>`,
    `Please click on the following link to reset your password:<br/>`,
    `This link valid until ${expireDate}<br/>`,
    `${url}`,
  ];
};

export const accountPasswordMessage = (user: UserDto, password: string): string[] => {
  return [
    `Welcome to our FE Camp Family, ${user.profile.firstName} ${user.profile.lastName} <br/>`,
    `your password is ${password}`,
  ];
};
