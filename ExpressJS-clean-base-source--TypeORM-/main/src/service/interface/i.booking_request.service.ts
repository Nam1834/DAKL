import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { BookingRequest } from '@/models/booking_request.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IBookingRequestService<T extends BaseModelType> extends IBaseCrudService<T> {
  calculateTotalCoins(tutorId: string, hoursPerLesson: number, totalLessons: number): Promise<number>;
  createBooking(userId: string, tutorId: string, data: CreateBookingRequestReq): Promise<void>;
  getListBookingRequest(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<BookingRequest>>;
  getMyBookingAcceptByTutorId(
    userId: string,
    tutorId: string,
    searchData: SearchDataDto
  ): Promise<PagingResponseDto<BookingRequest>>;
  cancelBookingRequestByUser(userId: string, bookingRequestId: string, click: string): Promise<void>;
  getMyBookingAcceptByTutorId(
    userId: string,
    tutorId: string,
    searchData: SearchDataDto
  ): Promise<PagingResponseDto<BookingRequest>>;
  solveBookingRequestByTutor(
    tutorId: string,
    bookingRequestId: string,
    click: string,
    noteOfTutor?: string
  ): Promise<void>;
  hireTutorFromBookingRequest(userId: string, bookingRequestId: string): Promise<void>;
}
