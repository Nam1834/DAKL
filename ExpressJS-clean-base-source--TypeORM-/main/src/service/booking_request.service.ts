import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { BookingRequestStatus } from '@/enums/booking_request-status.enum';
import { BookingRequest } from '@/models/booking_request.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IBookingRequestService } from '@/service/interface/i.booking_request.service';
import { SearchUtil } from '@/utils/search.util';
import ejs from 'ejs';
import { inject, injectable } from 'inversify';
import path from 'path';
import axios from 'axios';
import { SendEmailParams } from '@/dto/send-email/send-email-params.req';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { UserProfile } from '@/models/user_profile.model';
import { Classroom } from '@/models/classroom.model';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { addWeeks, endOfWeek } from 'date-fns';
import { ManagePayment } from '@/models/manage_payment.model';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import BaseError from '@/utils/error/base.error';
import { ErrorCode } from '@/enums/error-code.enums';
import { User } from '@/models/user.model';
import { IUserRepository } from '@/repository/interface/i.user.repository';

const EMAIL_API_URL: any = process.env.EMAIL_API_URL;
const X_SECRET_KEY: any = process.env.X_SECRET_KEY;

@injectable()
export class BookingRequestService
  extends BaseCrudService<BookingRequest>
  implements IBookingRequestService<BookingRequest>
{
  private bookingRequestRepository: IBookingRequestRepository<BookingRequest>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;
  private userProfileRepository: IUserProfileRepository<UserProfile>;
  private classroomRepository: IClassroomRepository<Classroom>;
  private managePaymentRepository: IManagePaymentRepository<ManagePayment>;
  private userRepository: IUserRepository<User>;

  constructor(
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('UserProfileRepository') userProfileRepository: IUserProfileRepository<UserProfile>,
    @inject('BookingRequestRepository') bookingRequestRepository: IBookingRequestRepository<BookingRequest>,
    @inject('ClassroomRepository') classroomRepository: IClassroomRepository<Classroom>,
    @inject('ManagePaymentRepository') managePaymentRepository: IManagePaymentRepository<ManagePayment>,
    @inject('UserRepository') userRepository: IUserRepository<User>
  ) {
    super(bookingRequestRepository);
    this.bookingRequestRepository = bookingRequestRepository;
    this.tutorProfileRepository = tutorProfileRepository;
    this.userProfileRepository = userProfileRepository;
    this.classroomRepository = classroomRepository;
    this.managePaymentRepository = managePaymentRepository;
    this.userRepository = userRepository;
  }

  async sendEmailViaApi(params: SendEmailParams): Promise<void> {
    const response = await axios.post(
      EMAIL_API_URL,
      {
        from: params.from,
        to: { emailAddresses: params.to.emailAddress },
        subject: params.subject,
        html: params.html
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-SECRET-KEY': X_SECRET_KEY
        }
      }
    );
  }

  async createBooking(userId: string, tutorId: string, data: CreateBookingRequestReq): Promise<void> {
    const tutor = await this.tutorProfileRepository.findOne({
      filter: { userId: tutorId }
    });

    if (!tutor) {
      throw new Error('Tutor does not exist');
    }

    const bookingRequest = new BookingRequest();
    bookingRequest.userId = userId;
    bookingRequest.tutorId = tutorId;
    bookingRequest.dateTimeLearn = data.dateTimeLearn.map((item) => JSON.stringify(item));
    bookingRequest.lessonsPerWeek = data.lessonsPerWeek;
    bookingRequest.totalLessons = data.totalLessons;
    bookingRequest.hoursPerLesson = data.hoursPerLesson;

    const totalCoinsRaw = data.totalLessons * data.hoursPerLesson * tutor.coinPerHours;
    const decimalPart = totalCoinsRaw - Math.floor(totalCoinsRaw);
    const totalCoins = decimalPart >= 0.5 ? Math.ceil(totalCoinsRaw) : Math.floor(totalCoinsRaw);
    bookingRequest.totalcoins = totalCoins;

    bookingRequest.startDay = new Date(data.startDay);

    await this.baseRepository.create({
      data: bookingRequest
    });
  }

  // async getMyListBookingRequestByTutorId(userId: string): Promise<void> {
  //   const bookingRequest = await this.bookingRequestRepository.findMany({
  //     filter: { userId: userId, status: BookingRequestStatus.REQUEST }
  //   });

  //   if (!bookingRequest) {
  //     throw new Error('You does not have request!');
  //   }
  // }

  async cancelBookingRequestByUser(userId: string, bookingRequestId: string, click: string): Promise<void> {
    const bookingRequest = await this.bookingRequestRepository.findOne({
      filter: { userId: userId, bookingRequestId: bookingRequestId, status: BookingRequestStatus.REQUEST }
    });

    if (!bookingRequest) {
      throw new Error('You does not booking this tutor!');
    }
    if (click === BookingRequestStatus.CANCEL) {
      const dataUpdate = new BookingRequest();
      dataUpdate.status = BookingRequestStatus.CANCEL;

      await this.bookingRequestRepository.findOneAndUpdate({
        filter: { bookingRequestId: bookingRequestId },
        updateData: dataUpdate
      });
    }
  }

  async getListBookingRequest(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<BookingRequest>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const bookingRequests = await this.bookingRequestRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      relations: ['user'],
      order: order,
      paging: paging
    });

    const total = await this.bookingRequestRepository.count({
      filter: { tutorId: tutorId }
    });

    return new PagingResponseDto(total, bookingRequests);
  }

  async solveBookingRequestByTutor(
    tutorId: string,
    bookingRequestId: string,
    click: string,
    noteOfTutor?: string
  ): Promise<void> {
    const bookingRequest = await this.bookingRequestRepository.findOne({
      filter: { bookingRequestId: bookingRequestId, tutorId: tutorId, status: BookingRequestStatus.REQUEST }
    });

    if (!bookingRequest) {
      throw new Error('Booking Reuqest does not exits!!');
    }
    if (click === BookingRequestStatus.ACCEPT) {
      const dataUpdate = new BookingRequest();
      dataUpdate.status = BookingRequestStatus.ACCEPT;

      await this.bookingRequestRepository.findOneAndUpdate({
        filter: { bookingRequestId: bookingRequest.bookingRequestId },
        updateData: dataUpdate
      });

      const user = await this.userProfileRepository.findOne({
        filter: { userId: bookingRequest.userId }
      });

      if (!user) {
        throw new Error('Can not find userr!');
      }

      const rootDir = process.cwd();
      const emailTemplatePath = path.join(rootDir, 'src/utils/email/success-email-booking-request.util.ejs');

      const emailContent = await ejs.renderFile(emailTemplatePath, {
        fullname: user.fullname
      });

      await this.sendEmailViaApi({
        from: { name: 'GiaSuVLU' },
        to: { emailAddress: [user.personalEmail] },
        subject: 'Thông báo duyệt yêu cầu',
        html: emailContent
      });
    } else if (click === BookingRequestStatus.REFUSE) {
      if (!noteOfTutor) {
        throw new Error('Note of tutor is required when refusing the booking request.');
      }
      const dataUpdate = new BookingRequest();
      dataUpdate.status = BookingRequestStatus.REFUSE;
      dataUpdate.noteOfTutor = noteOfTutor;

      await this.bookingRequestRepository.findOneAndUpdate({
        filter: { bookingRequestId: bookingRequest.bookingRequestId },
        updateData: dataUpdate
      });

      const user = await this.userProfileRepository.findOne({
        filter: { userId: bookingRequest.userId }
      });

      if (!user) {
        throw new Error('Can not find userr!');
      }

      const rootDir = process.cwd();
      const emailTemplatePath = path.join(rootDir, 'src/utils/email/fail-email-tutor-request.util.ejs');

      const emailContent = await ejs.renderFile(emailTemplatePath, {
        fullname: user.fullname
      });

      await this.sendEmailViaApi({
        from: { name: 'GiaSuVLU' },
        to: { emailAddress: [user.personalEmail] },
        subject: 'Thông từ chối yêu cầu',
        html: emailContent
      });
    }
  }

  async getMyBookingAcceptByTutorId(
    userId: string,
    tutorId: string,
    searchData: SearchDataDto
  ): Promise<PagingResponseDto<BookingRequest>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const bookingRequests = await this.bookingRequestRepository.findMany({
      filter: { userId: userId, tutorId: tutorId, status: BookingRequestStatus.ACCEPT, isHire: false, ...where },
      order: order,
      paging: paging
    });

    const total = await this.bookingRequestRepository.count({
      filter: { userId: userId, tutorId: tutorId, status: BookingRequestStatus.ACCEPT, isHire: false }
    });

    return new PagingResponseDto(total, bookingRequests);
  }

  async hireTutorFromBookingRequest(userId: string, bookingRequestId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      filter: { userId: userId }
    });

    if (!user) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy thông tin người dùng');
    }

    const bookingRequest = await this.bookingRequestRepository.findOne({
      filter: { bookingRequestId: bookingRequestId, status: BookingRequestStatus.ACCEPT, isHire: false }
    });

    if (!bookingRequest) {
      throw new Error('You does not have this booking!');
    }

    const tutorProfile = await this.tutorProfileRepository.findOne({
      filter: { userId: bookingRequest.tutorId }
    });

    if (!tutorProfile) {
      throw new Error('Tutor Profile does not exist!');
    }

    const userCoins = user.coin;
    const bookingCoins = bookingRequest.totalcoins;

    if (userCoins < bookingCoins) {
      throw new Error('You does not have enough coins!');
    } else {
      await this.userRepository.findOneAndUpdate({
        filter: { userId: userId },
        updateData: {
          coin: userCoins - bookingCoins
        }
      });

      //Cong coin cho gia su
      const tutor = await this.userRepository.findOne({
        filter: { userId: bookingRequest.tutorId }
      });

      if (!tutor) {
        throw new Error('Tutor does not exist!');
      }

      tutor.coin += Math.floor((bookingCoins * 90) / 100);

      await this.userRepository.findOneAndUpdate({
        filter: { userId: bookingRequest.tutorId },
        updateData: { coin: tutor.coin }
      });

      //Quan ly thanh toan cho gia su
      const managePayment = new ManagePayment();
      managePayment.userId = userId;
      managePayment.tutorId = bookingRequest.tutorId;
      managePayment.coinOfUserPayment = bookingCoins;
      managePayment.coinOfTutorReceive = tutor.coin;
      managePayment.coinOfWebReceive = bookingCoins - tutor.coin;

      await this.managePaymentRepository.create({
        data: managePayment
      });

      //Tao lop
      const classroom = new Classroom();
      classroom.userId = userId;
      classroom.tutorId = bookingRequest.tutorId;
      const content = `Lớp học của gia sư ${tutorProfile.fullname}`;
      classroom.nameOfRoom = content;
      classroom.dateTimeLearn = bookingRequest.dateTimeLearn;
      classroom.startDay = bookingRequest.startDay;

      const lessonsPerWeek = bookingRequest.lessonsPerWeek;
      const totalLessons = bookingRequest.totalLessons;
      const startDay = new Date(bookingRequest.startDay);
      const weeks = Math.ceil(totalLessons / lessonsPerWeek);
      const endDay = endOfWeek(
        addWeeks(startDay, weeks - 1),
        { weekStartsOn: 1 } // Tuần bắt đầu từ Thứ 2
      );

      classroom.endDay = endDay;

      await this.classroomRepository.create({
        data: classroom
      });
    }

    await this.bookingRequestRepository.findOneAndUpdate({
      filter: { bookingRequestId: bookingRequestId },
      updateData: { isHire: true }
    });
  }
}
