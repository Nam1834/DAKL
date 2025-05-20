export interface IStatisticalRepository {
  getStatisticsBetweenDates(time: number): Promise<{
    revenue: number;
    revenuePercentage: number;
    newUsers: number;
    newUserPercentage: number;
    newTutors: number;
    newTutorPercentage: number;
    // coursesPurchased: number;
    // coursesPurchasedPercentage: number;
    // newCourses: number;
    // newCoursesPercentage: number;
    // courseRatings: number;
    // courseRatingsPercentage: number;
    // averageRating: number;
    // averageRatingPercentage: number;
  }>;
}
