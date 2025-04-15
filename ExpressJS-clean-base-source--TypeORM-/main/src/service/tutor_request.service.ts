import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CancelRequestReq } from '@/dto/tutor/cancel-request.req';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { UpdateTutorProfileReq } from '@/dto/tutor/update-tutor-profile.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { TutorRequestType } from '@/enums/tutor-request-type.enum';
import { TutorRequestStatus } from '@/enums/tutor_request_status.enum';
import { UserTypeEnum } from '@/enums/user-type.enum';
import { MyCurriculumn } from '@/models/my_curriculumn.model';
import { TestResult } from '@/models/test_result.model';
import { TutorLevel } from '@/models/tutor_level.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { TutorRequest } from '@/models/tutor_request.model';
import { User } from '@/models/user.model';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { ITestResultRepository } from '@/repository/interface/i.test_result.repository';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { ITutorRequestRepository } from '@/repository/interface/i.tutor_request.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITutorRequestService } from '@/service/interface/i.tutor_request.service';
import { sendEmail } from '@/utils/email/email-sender.util';
import BaseError from '@/utils/error/base.error';
import { SearchUtil } from '@/utils/search.util';
import ejs from 'ejs';
import { inject, injectable } from 'inversify';
import path from 'path';

@injectable()
export class TutorRequestService extends BaseCrudService<TutorRequest> implements ITutorRequestService<TutorRequest> {
  private tutorRequestRepository: ITutorRequestRepository<TutorRequest>;
  private userRepository: IUserRepository<User>;
  private testResultRepository: ITestResultRepository<TestResult>;
  private tutorLevelRepository: ITutorLevelRepository<TutorLevel>;
  private myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;

  constructor(
    @inject('TutorRequestRepository') tutorRequestRepository: ITutorRequestRepository<TutorRequest>,
    @inject('UserRepository') userRepository: IUserRepository<User>,
    @inject('TestResultRepository') testResultRepository: ITestResultRepository<TestResult>,
    @inject('TutorLevelRepository') tutorLevelRepository: ITutorLevelRepository<TutorLevel>,
    @inject('MyCurriculumnRepository') myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>
  ) {
    super(tutorRequestRepository);
    this.tutorRequestRepository = tutorRequestRepository;
    this.userRepository = userRepository;
    this.testResultRepository = testResultRepository;
    this.tutorLevelRepository = tutorLevelRepository;
    this.myCurriculumnRepository = myCurriculumnRepository;
    this.tutorProfileRepository = tutorProfileRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<TutorRequest>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const tutorRequests = await this.tutorRequestRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.tutorRequestRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, tutorRequests);
  }

  async getMyNewestRequest(userId: string): Promise<TutorRequest> {
    const getMyRequests = await this.tutorRequestRepository.findMany({
      filter: { userId: userId },
      order: [
        {
          column: 'createdAt',
          direction: 'DESC'
        }
      ]
    });

    if (!getMyRequests || getMyRequests.length === 0) {
      throw new Error('Can not find your Request!');
    }

    return getMyRequests[0];
  }

  async getMyListRequest(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<TutorRequest>> {
    const { order, paging } = SearchUtil.getWhereCondition(searchData);

    const myRequests = await this.tutorRequestRepository.findMany({
      filter: { userId: userId },
      order: order,
      paging: paging
    });

    const total = await this.tutorRequestRepository.count({
      filter: { userId: userId }
    });

    return new PagingResponseDto(total, myRequests);
  }

  async convertUserReqToTutor(existingUser: User, data: RegisToTutorReq): Promise<TutorRequest> {
    const checkPassTest = await this.testResultRepository.findOne({
      filter: { userId: existingUser.userId }
    });

    if (!checkPassTest) {
      throw new Error('You must pass the test!');
    }

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
    tutorRequest.type = TutorRequestType.REGIS_TO_TUTOR;
    tutorRequest.status = TutorRequestStatus.REQUEST;

    tutorRequest.totalTestPoints = checkPassTest.points;

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

    const checkRequest = await this.tutorRequestRepository.findOne({
      filter: { userId: id, status: TutorRequestStatus.REQUEST }
    });

    if (checkRequest) {
      throw new Error('You are in REQUEST!');
    }

    const tutorRequest = await this.convertUserReqToTutor(existingUser, data);
    await this.tutorRequestRepository.createNewTutorRequest(tutorRequest);
    await this.tutorRequestRepository.save(tutorRequest);
  }

  async convertTutorReqToUpdate(existingUser: User, data: UpdateTutorProfileReq): Promise<TutorRequest> {
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
    tutorRequest.tutorLevelId = data.tutorLevelId;
    tutorRequest.type = TutorRequestType.UPDATE_PROFILE;
    tutorRequest.status = TutorRequestStatus.REQUEST;

    return tutorRequest;
  }

  async updateTutorProfile(id: string, data: UpdateTutorProfileReq): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      filter: {
        userId: id
      }
    });

    if (!existingUser) {
      throw new BaseError(ErrorCode.NF_01, 'User not found');
    }

    const checkRequest = await this.tutorRequestRepository.findOne({
      filter: { userId: id, status: TutorRequestStatus.REQUEST }
    });

    if (checkRequest) {
      throw new Error('You are in REQUEST!');
    }

    const tutorRequest = await this.convertTutorReqToUpdate(existingUser, data);
    await this.tutorRequestRepository.createNewTutorRequest(tutorRequest);
    await this.tutorRequestRepository.save(tutorRequest);
  }

  async solveRequest(tutorRequestId: string, click: string, tutorLevelId: string): Promise<void> {
    const checkStatus = await this.tutorRequestRepository.findOne({
      filter: { tutorRequestId: tutorRequestId, status: TutorRequestStatus.REQUEST }
    });

    if (!checkStatus) {
      throw new Error('You cant solve request ');
    }

    if (!Object.values(TutorRequestStatus).includes(click as TutorRequestStatus)) {
      throw new Error('You need to transmit the correct data');
    }

    if (click === TutorRequestStatus.ACCEPT) {
      if (!tutorLevelId) {
        throw new Error('You must Input Tutor Level Id');
      }
      const tutorLevel = await this.tutorLevelRepository.findOne({
        filter: { tutorLevelId }
      });

      if (!tutorLevel) {
        throw new Error('Invalid tutorLevelId');
      }

      // Tính toán coinPerHours
      const coinPerHours = tutorLevel.salary / 1000;

      if (checkStatus.type === TutorRequestType.REGIS_TO_TUTOR) {
        const tutorProfile = new TutorProfile();
        tutorProfile.userId = checkStatus.userId;
        tutorProfile.avatar = checkStatus.avatar;
        tutorProfile.fullname = checkStatus.fullname;
        tutorProfile.birthday = checkStatus.birthday;
        tutorProfile.gender = checkStatus.gender;
        tutorProfile.univercity = checkStatus.univercity;
        tutorProfile.majorId = checkStatus.majorId;
        tutorProfile.subjectId = checkStatus.subjectId;
        tutorProfile.evidenceOfSubject = checkStatus.evidenceOfSubject;
        tutorProfile.descriptionOfSubject = checkStatus.descriptionOfSubject;

        tutorProfile.subjectId2 = checkStatus.subjectId2;
        tutorProfile.evidenceOfSubject2 = checkStatus.evidenceOfSubject2;
        tutorProfile.descriptionOfSubject2 = checkStatus.descriptionOfSubject2;

        tutorProfile.subjectId3 = checkStatus.subjectId3;
        tutorProfile.evidenceOfSubject3 = checkStatus.evidenceOfSubject3;
        tutorProfile.descriptionOfSubject3 = checkStatus.descriptionOfSubject3;

        tutorProfile.GPA = checkStatus.GPA;
        tutorProfile.evidenceOfGPA = checkStatus.evidenceOfGPA;
        tutorProfile.description = checkStatus.description;
        tutorProfile.bankNumber = checkStatus.bankNumber;
        tutorProfile.bankName = checkStatus.bankName;
        tutorProfile.dateTimeLearn = checkStatus.dateTimeLearn;
        tutorProfile.teachingTime = checkStatus.teachingTime;
        tutorProfile.teachingMethod = checkStatus.teachingMethod;
        tutorProfile.teachingPlace = checkStatus.teachingPlace;
        tutorProfile.videoUrl = checkStatus.videoUrl;
        tutorProfile.isUseCurriculumn = checkStatus.isUseCurriculumn;
        tutorProfile.tutorLevelId = tutorLevelId;
        tutorProfile.coinPerHours = coinPerHours;

        await this.tutorProfileRepository.create({
          data: tutorProfile
        });

        await this.tutorRequestRepository.findOneAndUpdate({
          filter: { tutorRequestId: tutorRequestId },
          updateData: { status: TutorRequestStatus.ACCEPT, tutorLevelSolvedId: tutorLevelId }
        });

        await this.userRepository.findOneAndUpdate({
          filter: { userId: checkStatus.userId },
          updateData: {
            roleId: UserTypeEnum.TUTOR
          }
        });

        const myCurriculumn = new MyCurriculumn();
        myCurriculumn.userId = checkStatus.userId;

        await this.myCurriculumnRepository.create({
          data: myCurriculumn
        });

        // const rootDir = process.cwd();
        // const emailTemplatePath = path.join(rootDir, 'src/utils/email/success-email-regis-to-tutor.util.ejs');

        // const emailContent = await ejs.renderFile(emailTemplatePath, {
        //   fullname: checkStatus.fullname
        // });

        // await sendEmail({
        //   from: { name: 'GiaSuVLU' },
        //   to: { emailAddress: [checkStatus.fullname] },
        //   subject: 'Thông báo duyệt yêu cầu',
        //   html: emailContent
        // });
      } else if (checkStatus.type === TutorRequestType.UPDATE_PROFILE) {
        const tutorProfileUpdatePayload: Partial<TutorProfile> = {
          avatar: checkStatus.avatar,
          fullname: checkStatus.fullname,
          birthday: checkStatus.birthday,
          gender: checkStatus.gender,
          univercity: checkStatus.univercity,
          majorId: checkStatus.majorId,
          subjectId: checkStatus.subjectId,
          evidenceOfSubject: checkStatus.evidenceOfSubject,
          descriptionOfSubject: checkStatus.descriptionOfSubject,
          subjectId2: checkStatus.subjectId2,
          evidenceOfSubject2: checkStatus.evidenceOfSubject2,
          descriptionOfSubject2: checkStatus.descriptionOfSubject2,
          subjectId3: checkStatus.subjectId3,
          evidenceOfSubject3: checkStatus.evidenceOfSubject3,
          descriptionOfSubject3: checkStatus.descriptionOfSubject3,
          GPA: checkStatus.GPA,
          evidenceOfGPA: checkStatus.evidenceOfGPA,
          description: checkStatus.description,
          bankNumber: checkStatus.bankNumber,
          bankName: checkStatus.bankName,
          dateTimeLearn: checkStatus.dateTimeLearn,
          teachingMethod: checkStatus.teachingMethod,
          teachingPlace: checkStatus.teachingPlace,
          videoUrl: checkStatus.videoUrl,
          isUseCurriculumn: checkStatus.isUseCurriculumn,
          teachingTime: checkStatus.teachingTime,
          tutorLevelId: tutorLevelId,
          coinPerHours: coinPerHours
        };

        Object.keys(tutorProfileUpdatePayload).forEach(
          (key) =>
            tutorProfileUpdatePayload[key as keyof TutorProfile] === undefined &&
            delete tutorProfileUpdatePayload[key as keyof TutorProfile]
        );

        await this.tutorProfileRepository.findOneAndUpdate({
          filter: { userId: checkStatus.userId },
          updateData: tutorProfileUpdatePayload
        });

        await this.tutorRequestRepository.findOneAndUpdate({
          filter: { tutorRequestId: tutorRequestId },
          updateData: { status: TutorRequestStatus.ACCEPT, tutorLevelSolvedId: tutorLevelId }
        });
      }
      // const rootDir = process.cwd();
      // const emailTemplatePath = path.join(rootDir, 'src/utils/email/success-email-update-tutor.util.ejs');

      // const emailContent = await ejs.renderFile(emailTemplatePath, {
      //   fullname: checkStatus.fullname
      // });

      // await sendEmail({
      //   from: { name: 'GiaSuVLU' },
      //   to: { emailAddress: [checkStatus.fullname] },
      //   subject: 'Thông báo duyệt yêu cầu',
      //   html: emailContent
      // });
    } else if (click === TutorRequestStatus.REFUSE) {
      await this.tutorRequestRepository.findOneAndUpdate({
        filter: { tutorRequestId: tutorRequestId },
        updateData: {
          status: TutorRequestStatus.REFUSE
        }
      });
      // const rootDir = process.cwd();
      // const emailTemplatePath = path.join(rootDir, 'src/utils/email/fail-email-tutor-request.util.ejs');

      // const emailContent = await ejs.renderFile(emailTemplatePath, {
      //   fullname: checkStatus.fullname
      // });

      // await sendEmail({
      //   from: { name: 'GiaSuVLU' },
      //   to: { emailAddress: [checkStatus.fullname] },
      //   subject: 'Thông báo duyệt yêu cầu',
      //   html: emailContent
      // });
    }
  }

  async getMyNewRequest(): Promise<void> {}

  async cancelRequest(tutorRequestId: string, data: CancelRequestReq): Promise<void> {
    const tutorRequest = await this.tutorRequestRepository.findOne({
      filter: { tutorRequestId: tutorRequestId, status: TutorRequestStatus.REQUEST }
    });
    if (!tutorRequest) {
      throw new Error('Can not find request!');
    }

    await this.tutorRequestRepository.findOneAndUpdate({
      filter: { tutorRequestId: tutorRequestId },
      updateData: { status: data.status }
    });
  }
}
