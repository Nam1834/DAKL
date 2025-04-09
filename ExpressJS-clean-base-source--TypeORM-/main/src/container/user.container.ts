import { UserController } from '@/controller/user.controller';
import { UserService } from '@/service/user.service';
import { User } from '@/models/user.model';
import { UserRepository } from '@/repository/user.repository';
import { IUserService } from '@/service/interface/i.user.service';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { BaseContainer } from '@/container/base.container';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { userProfileRepository } from './user_profile.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { tutorProfileRepository } from './tutor_profile.container';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { myCurriculumnRepository } from './my_curriculumn.container';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { curriculumnRepository } from './curriculumn.container';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { myCurriculumnItemRepository } from './my_curriculumn_item.container';
import { ITutorSubjectRepository } from '@/repository/interface/i.tutor_subject.repository';
import { tutorSubjectRepository } from './tutor_subject.container';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { tutorLevelRepository } from './tutor_level.container';
import { IMyTutorRepository } from '@/repository/interface/i.my_tutor.repository';
import { myTutorRepository } from './my_tutor.container';

class UserContainer extends BaseContainer {
  constructor() {
    super(User);
    this.container.bind<IUserService<User>>('UserService').to(UserService);
    this.container.bind<IUserRepository<User>>('UserRepository').to(UserRepository);
    this.container.bind<UserController>(UserController).toSelf();

    //Import
    this.container.bind<IUserProfileRepository<any>>('UserProfileRepository').toConstantValue(userProfileRepository);
    this.container.bind<ITutorProfileRepository<any>>('TutorProfileRepository').toConstantValue(tutorProfileRepository);
    this.container
      .bind<IMyCurriculumnRepository<any>>('MyCurriculumnRepository')
      .toConstantValue(myCurriculumnRepository);
    this.container.bind<ICurriculumnRepository<any>>('CurriculumnRepository').toConstantValue(curriculumnRepository);
    this.container
      .bind<IMyCurriculumnItemRepository<any>>('MyCurriculumnItemRepository')
      .toConstantValue(myCurriculumnItemRepository);
    this.container.bind<ITutorSubjectRepository<any>>('TutorSubjectRepository').toConstantValue(tutorSubjectRepository);
    this.container.bind<ITutorLevelRepository<any>>('TutorLevelRepository').toConstantValue(tutorLevelRepository);
    this.container.bind<IMyTutorRepository<any>>('MyTutorRepository').toConstantValue(myTutorRepository);
  }

  export() {
    const userController = this.container.get<UserController>(UserController);
    const userService = this.container.get<IUserService<any>>('UserService');
    const userRepository = this.container.get<IUserRepository<any>>('UserRepository');

    return { userController, userService, userRepository };
  }
}

const userContainer = new UserContainer();
const { userController, userService, userRepository } = userContainer.export();
export { userController, userService, userRepository };
