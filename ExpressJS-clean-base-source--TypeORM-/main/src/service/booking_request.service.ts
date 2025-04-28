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
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { User } from '@/models/user.model';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { UserProfile } from '@/models/user_profile.model';

const EMAIL_API_URL: any = process.env.EMAIL_API_URL;
const X_SECRET_KEY: any = process.env.X_SECRET_KEY;

@injectable()
export class BookingRequestService
  extends BaseCrudService<BookingRequest>
  implements IBookingRequestService<BookingRequest>
{
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;
  private bookingRequestRepository: IBookingRequestRepository<BookingRequest>;
  private userProfileRepository: IUserProfileRepository<UserProfile>;

  constructor(
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('UserProfileRepository') userProfileRepository: IUserProfileRepository<UserProfile>,
    @inject('BookingRequestRepository') bookingRequestRepository: IBookingRequestRepository<BookingRequest>
  ) {
    super(bookingRequestRepository);
    this.bookingRequestRepository = bookingRequestRepository;
    this.tutorProfileRepository = tutorProfileRepository;
    this.userProfileRepository = userProfileRepository;
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

  async getMyBookingAccept(userId: string): Promise<void> {}

  async hireTutorFromBookingRequest(tutorId: string): Promise<void> {}
}
