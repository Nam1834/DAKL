import { RevenuePagingResponseDto } from '@/dto/paging-response-revenue.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { BookingRequest } from '@/models/booking_request.model';
import { ManagePayment } from '@/models/manage_payment.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';
import { filter } from 'lodash';
import { Between, In } from 'typeorm';

@injectable()
export class ManagePaymentService
  extends BaseCrudService<ManagePayment>
  implements IManagePaymentService<ManagePayment>
{
  private managePaymentRepository: IManagePaymentRepository<ManagePayment>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;
  private bookingRequestRepository: IBookingRequestRepository<BookingRequest>;

  constructor(
    @inject('ManagePaymentRepository') managePaymentRepository: IManagePaymentRepository<ManagePayment>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('BookingRequestRepository') bookingRequestRepository: IBookingRequestRepository<BookingRequest>
  ) {
    super(managePaymentRepository);
    this.managePaymentRepository = managePaymentRepository;
    this.tutorProfileRepository = tutorProfileRepository;
    this.bookingRequestRepository = bookingRequestRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const payments = await this.managePaymentRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.managePaymentRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, payments);
  }

  async searchForTutor(tutorId: string, searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const payments = await this.managePaymentRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      order: order,
      paging: paging
    });

    const total = await this.managePaymentRepository.count({
      filter: where
    });

    // Tong doanh thu
    const totalRevenue = await this.managePaymentRepository.sum('coinOfTutorReceive', {
      tutorId,
      ...where
    });

    return new RevenuePagingResponseDto(total, payments, totalRevenue);
  }

  async searchWithTimeForTutor(
    tutorId: string,
    searchData: SearchDataDto
  ): Promise<RevenuePagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    if (searchData.startDate && searchData.endDate) {
      Object.assign(where, {
        createdAt: Between(new Date(searchData.startDate), new Date(searchData.endDate))
      });
    } else if (searchData.periodType) {
      const now = new Date();
      const timeStart = new Date(now);

      switch (searchData.periodType) {
        case 'DAY':
          timeStart.setDate(now.getDate() - (searchData.periodValue ?? 1));
          break;
        case 'WEEK':
          timeStart.setDate(now.getDate() - 7 * (searchData.periodValue ?? 1));
          break;
        case 'MONTH':
          timeStart.setMonth(now.getMonth() - (searchData.periodValue ?? 1));
          break;
        case 'YEAR':
          timeStart.setFullYear(now.getFullYear() - (searchData.periodValue ?? 1));
          break;
      }
      Object.assign(where, {
        createdAt: Between(timeStart, now)
      });
    }

    const payments = await this.managePaymentRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      order: order,
      paging: paging
    });

    const total = await this.managePaymentRepository.count({
      filter: { tutorId: tutorId, ...where }
    });

    // Tong doanh thu
    const totalRevenue = await this.managePaymentRepository.sum('coinOfTutorReceive', {
      tutorId,
      ...where
    });

    return new RevenuePagingResponseDto(total, payments, totalRevenue);
  }

  async searchWithTime(searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    if (searchData.startDate && searchData.endDate) {
      Object.assign(where, {
        createdAt: Between(new Date(searchData.startDate), new Date(searchData.endDate))
      });
    } else if (searchData.periodType) {
      const now = new Date();
      const timeStart = new Date(now);

      switch (searchData.periodType) {
        case 'DAY':
          timeStart.setDate(now.getDate() - (searchData.periodValue ?? 1));
          break;
        case 'WEEK':
          timeStart.setDate(now.getDate() - 7 * (searchData.periodValue ?? 1));
          break;
        case 'MONTH':
          timeStart.setMonth(now.getMonth() - (searchData.periodValue ?? 1));
          break;
        case 'YEAR':
          timeStart.setFullYear(now.getFullYear() - (searchData.periodValue ?? 1));
          break;
      }
      Object.assign(where, {
        createdAt: Between(timeStart, now)
      });
    }

    // Lấy danh sách tutorProfile theo filter
    const managePayments = await this.managePaymentRepository.findMany({
      filter: where,
      paging: paging,
      relations: ['tutor'],
      order: order
    });

    const total = await this.managePaymentRepository.count({
      filter: where
    });

    const totalPayment = await this.managePaymentRepository.sum('coinOfTutorReceive', where);

    return new RevenuePagingResponseDto(total, managePayments, totalPayment);
  }

  async searchWithTimeForTutorRevenue(searchData: SearchDataDto): Promise<PagingResponseDto<TutorProfile>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const tutors = await this.tutorProfileRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.tutorProfileRepository.count({
      filter: where
    });

    const tutorIds = tutors.map((t) => t.userId);

    let bookingRequests: BookingRequest[] = [];
    let managePayments: ManagePayment[] = [];

    let timeStart: Date | null = null;
    let timeEnd: Date | null = null;

    // Xử lý startDate và endDate (dd/MM/yyyy) hoặc ISO string
    if (searchData.startDate && searchData.endDate) {
      if (typeof searchData.startDate === 'string' && typeof searchData.endDate === 'string') {
        // Parse định dạng dd/MM/yyyy
        const [startDay, startMonth, startYear] = searchData.startDate.split('/').map(Number);
        const [endDay, endMonth, endYear] = searchData.endDate.split('/').map(Number);
        timeStart = new Date(startYear, startMonth - 1, startDay);
        timeEnd = new Date(endYear, endMonth - 1, endDay + 1); // Bao trùm cả ngày end
      } else {
        // Nếu là Date hoặc ISO string
        timeStart = new Date(searchData.startDate);
        timeEnd = new Date(searchData.endDate);
        timeEnd.setDate(timeEnd.getDate() + 1); // Bao trùm ngày end
      }
    } else if (searchData.periodType) {
      timeEnd = new Date();
      timeStart = new Date(timeEnd);

      switch (searchData.periodType) {
        case 'DAY':
          timeStart.setDate(timeEnd.getDate() - (searchData.periodValue ?? 1));
          break;
        case 'WEEK':
          timeStart.setDate(timeEnd.getDate() - 7 * (searchData.periodValue ?? 1));
          break;
        case 'MONTH':
          timeStart.setMonth(timeEnd.getMonth() - (searchData.periodValue ?? 1));
          break;
        case 'YEAR':
          timeStart.setFullYear(timeEnd.getFullYear() - (searchData.periodValue ?? 1));
          break;
      }
    }

    // Nếu có khoảng thời gian hợp lệ
    if (timeStart && timeEnd) {
      Object.assign(where, {
        createdAt: Between(timeStart, timeEnd)
      });

      bookingRequests = await this.bookingRequestRepository.findBookingRequestsByTutorIdsAndIsHire(
        tutorIds,
        timeStart,
        timeEnd
      );

      managePayments = await this.managePaymentRepository.findManagePaymentsByTutorIds(tutorIds, timeStart, timeEnd);
    }

    // Đếm số lần hire theo tutorId
    const hireCountMap = new Map<string, number>();
    bookingRequests.forEach((br) => {
      const current = hireCountMap.get(br.tutorId) || 0;
      hireCountMap.set(br.tutorId, current + 1);
    });

    // Tính tổng coinOfTutorReceive theo tutorId
    const revenueMap = new Map<string, number>();
    managePayments.forEach((mp) => {
      const current = revenueMap.get(mp.tutorId) || 0;
      revenueMap.set(mp.tutorId, current + mp.coinOfTutorReceive);
    });

    // Gắn vào từng tutor
    tutors.forEach((tutor) => {
      const tutorId = tutor.userId;
      (tutor as any).totalHire = hireCountMap.get(tutorId) || 0;
      (tutor as any).totalRevenueWithTime = revenueMap.get(tutorId) || 0;
    });

    return new PagingResponseDto(total, tutors);
  }
}
