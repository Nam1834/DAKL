import { BookingRequestStatus } from '@/enums/booking_request-status.enum';
import { BookingRequest } from '@/models/booking_request.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class BookingRequestRepository
  extends BaseRepository<BookingRequest>
  implements IBookingRequestRepository<BookingRequest>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(BookingRequest));
  }

  async findBookingRequestsByTutorIds(
    userId: string,
    tutorIds: string[],
    status: BookingRequestStatus
  ): Promise<BookingRequest[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('bookingRequest');

    queryBuilder
      .where('bookingRequest.userId = :userId', { userId })
      .andWhere('bookingRequest.tutorId IN (:...tutorIds)', { tutorIds })
      .andWhere('bookingRequest.status = :status', { status });

    const bookingRequests = await queryBuilder.getMany();
    return bookingRequests;
  }
}
