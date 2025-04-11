import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { TutorRequestType } from '@/enums/tutor-request-type.enum';
import { TutorRequest } from '@/models/tutor_request.model';
import { User } from '@/models/user.model';
import { ITutorRequestRepository } from '@/repository/interface/i.tutor_request.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITutorRequestService } from '@/service/interface/i.tutor_request.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorRequestService extends BaseCrudService<TutorRequest> implements ITutorRequestService<TutorRequest> {
  private tutorRequestRepository: ITutorRequestRepository<TutorRequest>;
  private userRepository: IUserRepository<User>;

  constructor(
    @inject('TutorRequestRepository') tutorRequestRepository: ITutorRequestRepository<TutorRequest>,
    @inject('UserRepository') userRepository: IUserRepository<User>
  ) {
    super(tutorRequestRepository);
    this.tutorRequestRepository = tutorRequestRepository;
    this.userRepository = userRepository;
  }

  async convertUserReqToTutor(existingUser: User, data: RegisToTutorReq): Promise<TutorRequest> {
    const tutorRequest = new TutorRequest();
    tutorRequest.userId = existingUser.userId;
    tutorRequest.avatar = data.avatar;
    tutorRequest.fullname = data.fullname;
    tutorRequest.majorId = data.majorId;
    tutorRequest.birthday = new Date(data.birthday);
    tutorRequest.gender = data.gender;
    tutorRequest.bankNumber = data.bankNumber;
    tutorRequest.bankName = data.bankName;
    tutorRequest.GPA = data.GPA;
    tutorRequest.evidenceOfGPA = data.evidenceOfGPA;
    tutorRequest.dateTimeLearn = data.dateTimeLearn.map((item) => JSON.stringify(item));
    tutorRequest.teachingTime = data.teachingTime;
    tutorRequest.description = data.description;
    tutorRequest.subjectId = data.subjectId;
    tutorRequest.evidenceOfSubject = data.evidenceOfSubject;
    tutorRequest.univercity = data.univercity;
    tutorRequest.videoUrl = data.videoUrl;
    tutorRequest.teachingTime = data.teachingTime;
    tutorRequest.descriptionOfSubject = data.descriptionOfSubject;
    tutorRequest.isUseCurriculumn = data.isUseCurriculumn;

    tutorRequest.subjectId2 = data.subjectId2;
    tutorRequest.evidenceOfSubject2 = data.evidenceOfSubject2;
    tutorRequest.descriptionOfSubject2 = data.descriptionOfSubject2;

    tutorRequest.subjectId3 = data.subjectId3;
    tutorRequest.evidenceOfSubject3 = data.evidenceOfSubject3;
    tutorRequest.descriptionOfSubject3 = data.descriptionOfSubject3;

    tutorRequest.teachingMethod = data.teachingMethod;
    tutorRequest.teachingPlace = data.teachingPlace;

    return tutorRequest;
  }

  async regisToTutor(id: string, data: RegisToTutorReq): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      filter: {
        userId: id
      }
    });

    if (!existingUser) {
      throw new BaseError(ErrorCode.NF_01, 'User not found');
    }

    const tutorRequest = await this.convertUserReqToTutor(existingUser, data);
    await this.tutorRequestRepository.createNewTutorRequest(tutorRequest);
    await this.tutorRequestRepository.save(tutorRequest);
  }
}
