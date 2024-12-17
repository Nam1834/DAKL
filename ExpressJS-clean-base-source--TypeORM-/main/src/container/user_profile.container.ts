import { UserProfile } from '@/models/user_profile.model';
import { UserProfileRepository } from '@/repository/user_profile.repository';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { BaseContainer } from '@/container/base.container';

class UserProfileContainer extends BaseContainer {
  constructor() {
    super(UserProfile);
    this.container.bind<IUserProfileRepository<UserProfile>>('UserProfileRepository').to(UserProfileRepository);
  }

  export() {
    const userProfileRepository = this.container.get<IUserProfileRepository<any>>('UserProfileRepository');

    return { userProfileRepository };
  }
}

const userProfileContainer = new UserProfileContainer();
const { userProfileRepository } = userProfileContainer.export();
export { userProfileRepository };
