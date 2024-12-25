import { Expose } from 'class-transformer';

export class LoginMicrosoftRes {
  @Expose()
  user: {
    userId: string;
    userProfile: {
      fullname: string;
      personalEmail: string;
      workEmail: string;
      homeAddress?: string;
      birthday?: string;
      gender: 'MALE' | 'FEMALE';
    };
  };

  @Expose()
  token: string;

  constructor() {
    this.user = {
      userId: '',
      userProfile: {
        fullname: '',
        personalEmail: '',
        workEmail: '',
        homeAddress: '',
        birthday: '',
        gender: 'MALE'
      }
    };
    this.token = '';
  }
}
