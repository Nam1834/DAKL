import { ClassroomStatus } from '@/enums/classroom-status.enum';
import { UserTypeEnum } from '@/enums/user-type.enum';
import { Classroom } from '@/models/classroom.model';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { ManagePayment } from '@/models/manage_payment.model';
import { Order } from '@/models/order.model';
import { TutorRequest } from '@/models/tutor_request.model';
import { User } from '@/models/user.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IStatisticalRepository } from '@/repository/interface/i.statistical.repository';
import { ITYPES } from '@/types/interface.types';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Between, DataSource } from 'typeorm';

@injectable()
export class StatisticalRepository implements IStatisticalRepository {
  constructor(@inject(ITYPES.Datasource) private dataSource: DataSource) {}

  async getStatisticsBetweenDates(time: number): Promise<{
    revenue: number;
    revenuePercentage: number;
    newUsers: number;
    newUserPercentage: number;
    newTutors: number;
    newTutorPercentage: number;
    newTutorRequest: number;
    newTutorRequestPercentage: number;
    newClassActive: number;
    newClassActivePercentage: number;
    classroomRating: number;
    classroomRatingPercentage: number;
    totalManagePayment: number;
    totalManagePaymentPercentage: number;
  }> {
    const orderRepository = this.dataSource.getRepository(Order);
    const tutorRequestRepository = this.dataSource.getRepository(TutorRequest);
    const userRepository = this.dataSource.getRepository(User);
    const classroomRepository = this.dataSource.getRepository(Classroom);
    const classroomAssessmentRepository = this.dataSource.getRepository(ClassroomAssessment);
    const managePaymentRepository = this.dataSource.getRepository(ManagePayment);

    //hai mốc thời gian
    const currentTimeEnd = new Date();
    const currentTimeStart = new Date();
    currentTimeStart.setTime(currentTimeEnd.getTime() - (time * 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000));
    const previousTimeEnd = new Date();
    previousTimeEnd.setTime(currentTimeEnd.getTime() - time * 24 * 60 * 60 * 1000);
    const previousTimeStart = new Date();
    previousTimeStart.setTime(currentTimeStart.getTime() - time * 24 * 60 * 60 * 1000);

    //tính doanh thu hiện tại
    const order = await orderRepository.find({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd), status: 'PAID' }
    });
    const revenue = order.reduce((acc, order) => acc + Number(order.totalPrice), 0);

    //tính doanh thu đợt trước
    const previousOrder = await orderRepository.find({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd), status: 'PAID' }
    });
    const previousRevenue = previousOrder.reduce((acc, order) => acc + Number(order.totalPrice), 0);

    //tính phần trăm doanh thu
    const revenuePercentage = PercentageChange(revenue, previousRevenue);

    //managepayment
    const managePayments = await managePaymentRepository.find({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd) }
    });
    const totalManagePayment = managePayments.reduce((acc, payment) => acc + Number(payment.coinOfWebReceive), 0);

    // Tổng coinOfWebReceive trong đợt trước
    const previousManagePayments = await managePaymentRepository.find({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd) }
    });
    const previousTotalManagePayment = previousManagePayments.reduce(
      (acc, payment) => acc + Number(payment.coinOfWebReceive),
      0
    );

    // Phần trăm thay đổi
    const totalManagePaymentPercentage = PercentageChange(totalManagePayment, previousTotalManagePayment);

    //tính số học sinh mới hiện tại
    const newUsers = await userRepository.count({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd), roleId: UserTypeEnum.USER }
    });
    //tính số học sinh mới đợt trước
    const previousNewUsers = await userRepository.count({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd), roleId: UserTypeEnum.USER }
    });

    //tính phần trăm học sinh
    const newUserPercentage = PercentageChange(newUsers, previousNewUsers);

    //tính số giảng viên mới hiện tại
    const newTutors = await userRepository.count({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd), roleId: UserTypeEnum.TUTOR }
    });

    //tính số giảng viên mới đợt trước
    const previousNewTutor = await userRepository.count({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd), roleId: UserTypeEnum.TUTOR }
    });

    //tính phần trăm giảng viên
    const newTutorPercentage = PercentageChange(newTutors, previousNewTutor);

    // //tính số yêu cầu mới hiện tại
    const newTutorRequest = await tutorRequestRepository.count({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd) }
    });

    // tính số yêu cầu mới đợt trước
    const previousNewTutorRequest = await tutorRequestRepository.count({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd) }
    });

    //tính phần trăm yêu cầu
    const newTutorRequestPercentage = PercentageChange(newTutorRequest, previousNewTutorRequest);

    //tính số lượt mua hiện tại
    const payments = await orderRepository.find({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd), status: 'PAID' },
      relations: ['items']
    });
    const orderPurchased = payments.reduce((acc, order) => {
      return acc + (Array.isArray(order.items) ? order.items.length : 0);
    }, 0);
    //tính số lượt mua đợt trước
    const previousPayments = await orderRepository.find({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd), status: 'PAID' },
      relations: ['items']
    });
    const previousOrdersPurchased = previousPayments.reduce((acc, order) => {
      return acc + (Array.isArray(order.items) ? order.items.length : 0);
    }, 0);
    //tính phần trăm số lượt mua
    const orderPurchasedPercentage = PercentageChange(orderPurchased, previousOrdersPurchased);

    //tính số lượt đánh giá khóa học
    // const courseRatings = await courseRatingRepository.count({
    //   where: { createAt: Between(currentTimeStart, currentTimeEnd) }
    // });

    //tính số lượt đánh giá đợt trước
    // const previousCourseRatings = await courseRatingRepository.count({
    //   where: { createAt: Between(previousTimeStart, previousTimeEnd) }
    // });

    // //tính phần trăm số đánh giá
    // const courseRatingsPercentage = PercentageChange(courseRatings, previousCourseRatings);

    //tính trung bình số sao
    // const rating = await courseRatingRepository.find({
    //   where: { createAt: Between(currentTimeStart, currentTimeEnd) }
    // });

    // const averageRating =
    //   rating.length > 0 ? rating.reduce((acc, rating) => acc + (rating.ratingPoint ?? 0), 0) / rating.length : 0;
    // //tính trung bình số sao đợt trước
    // const previousRating = await courseRatingRepository.find({
    //   where: { createAt: Between(previousTimeStart, previousTimeEnd) }
    // });
    // const previousAverageRating =
    //   previousRating.length > 0
    //     ? previousRating.reduce((acc, rating) => acc + (rating.ratingPoint ?? 0), 0) / previousRating.length
    //     : 0;
    //tính phần trăm số đánh giá
    // const averageRatingPercentage = PercentageChange(averageRating, previousAverageRating);
    // //tính số lớp học hoạt động mới hiện tại
    const newClassActive = await classroomRepository.count({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd), status: ClassroomStatus.IN_SESSION }
    });

    // tính số lớp học hoạt động mới đợt trước
    const previousnewClassActive = await classroomRepository.count({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd), status: ClassroomStatus.IN_SESSION }
    });

    //tính phần trăm lớp học hoạt động
    const newClassActivePercentage = PercentageChange(newClassActive, previousnewClassActive);

    // //tính số lớp học hoạt động mới hiện tại
    const classroomRating = await classroomAssessmentRepository.count({
      where: { createdAt: Between(currentTimeStart, currentTimeEnd) }
    });

    // tính số lớp học hoạt động mới đợt trước
    const previousclassroomRatingClassActive = await classroomAssessmentRepository.count({
      where: { createdAt: Between(previousTimeStart, previousTimeEnd) }
    });

    //tính phần trăm lớp học hoạt động
    const classroomRatingPercentage = PercentageChange(classroomRating, previousclassroomRatingClassActive);

    return {
      revenue,
      revenuePercentage,
      newUsers,
      newUserPercentage,
      newTutors,
      newTutorPercentage,
      // newCourses,
      // newCoursesPercentage,
      // coursesPurchased,
      // coursesPurchasedPercentage,
      // courseRatings,
      // courseRatingsPercentage,
      // averageRating,
      // averageRatingPercentage
      newTutorRequest,
      newTutorRequestPercentage,
      newClassActive,
      newClassActivePercentage,
      classroomRating,
      classroomRatingPercentage,
      totalManagePayment,
      totalManagePaymentPercentage
    };
  }
  async getDailyRevenue() {
    const ordersRepository = this.dataSource.getRepository(Order);
    const timeEnd = new Date();
    console.log(timeEnd);
    const timeStart = new Date();
    timeStart.setTime(timeEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
    timeEnd.setHours(23, 59, 59, 999);
    const orders = await ordersRepository.find({
      where: { createdAt: Between(timeStart, timeEnd), status: 'PAID' }
    });

    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(timeStart);
      day.setTime(timeStart.getTime() + (index + 1) * 24 * 60 * 60 * 1000);

      const startOfDay = new Date(day.setHours(0, 0, 0, 0));
      const endOfDay = new Date(day.setHours(23, 59, 59, 999));

      const dayRevenue = orders
        .filter((order) => order.createdAt >= startOfDay && order.createdAt <= endOfDay)
        .reduce((sum, order) => sum + Number(order.totalPrice), 0);

      return {
        date: startOfDay.toISOString().split('T')[0], // YYYY-MM-DD
        revenue: dayRevenue
      };
    });
  }
  async getWeeksRevenue() {
    const ordersRepository = this.dataSource.getRepository(Order);
    const timeEnd = new Date();
    const timeStart = new Date();
    timeStart.setDate(timeEnd.getDate() - 28);
    console.log(timeStart);
    const orders = await ordersRepository.find({
      where: { createdAt: Between(timeStart, timeEnd), status: 'PAID' }
    });
    return Array.from({ length: 4 }, (_, index) => {
      const weekStart = new Date(timeStart);
      weekStart.setDate(timeStart.getDate() + (index + 1) * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      console.log(weekStart);
      console.log(weekEnd);
      const weekRevenue = orders
        .filter((order) => {
          return order.createdAt >= weekStart && order.createdAt <= weekEnd;
        })
        .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);

      return {
        week: `Week ${4 - index}`,
        revenue: weekRevenue
      };
    }).reverse();
  }
  async getMonthsRevenue() {
    const ordersRepository = this.dataSource.getRepository(Order);
    const timeEnd = new Date();
    const timeStart = new Date(timeEnd);
    timeStart.setTime(timeEnd.getTime() - 365 * 24 * 60 * 60 * 1000);

    const orders = await ordersRepository.find({
      where: { createdAt: Between(timeStart, timeEnd), status: 'PAID' }
    });

    return Array.from({ length: 12 }, (_, index) => {
      const month = new Date(timeStart);
      month.setMonth(timeStart.getMonth() + index + 1);

      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const monthRevenue = orders
        .filter((order) => order.createdAt >= startOfMonth && order.createdAt <= endOfMonth)
        .reduce((acc, order) => acc + Number(order.totalPrice), 0);

      return {
        month: `${startOfMonth.getFullYear()}-${startOfMonth.getMonth() + 1}`,
        revenue: monthRevenue
      };
    });
  }
}
function PercentageChange(currentValue: number, previousValue: number): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : -100;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
}
