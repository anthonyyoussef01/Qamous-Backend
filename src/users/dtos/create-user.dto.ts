export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  dateOfBirth: Date;
  createdAt: Date;
}
