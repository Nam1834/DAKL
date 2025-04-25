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
import { inject, injectable } from 'inversify';

@injectable()
export class BookingRequestService
  extends BaseCrudService<BookingRequest>
  implements IBookingRequestService<BookingRequest>
{
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;
  private bookingRequestRepository: IBookingRequestRepository<BookingRequest>;

  constructor(
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('BookingRequestRepository') bookingRequestRepository: IBookingRequestRepository<BookingRequest>
  ) {
    super(bookingRequestRepository);
    this.bookingRequestRepository = bookingRequestRepository;
    this.tutorProfileRepository = tutorProfileRepository;
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

  async cancelBookingRequestByTutorId(userId: string, tutorId: string, click: string): Promise<void> {
    const bookingRequest = await this.bookingRequestRepository.findOne({
      filter: { userId: userId, tutorId: tutorId, status: BookingRequestStatus.REQUEST }
    });

    if (!bookingRequest) {
      throw new Error('You does not booking this tutor!');
    }
    if (click === BookingRequestStatus.CANCEL) {
      const dataUpdate = new BookingRequest();
      dataUpdate.status = BookingRequestStatus.CANCEL;

      await this.bookingRequestRepository.findOneAndUpdate({
        filter: { bookingRequestId: bookingRequest.bookingRequestId },
        updateData: dataUpdate
      });
    }
  }

  async getListBookingRequest(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<BookingRequest>> {
    const { order, paging } = SearchUtil.getWhereCondition(searchData);

    const bookingRequests = await this.bookingRequestRepository.findMany({
      filter: { tutorId: tutorId },
      order: order,
      paging: paging
    });

    const total = await this.bookingRequestRepository.count({
      filter: { tutorId: tutorId }
    });

    return new PagingResponseDto(total, bookingRequests);
  }

  async solveBookingRequestByTutor(): Promise<void> {}

  async hireTutorFromBookingRequest(): Promise<void> {}
}
