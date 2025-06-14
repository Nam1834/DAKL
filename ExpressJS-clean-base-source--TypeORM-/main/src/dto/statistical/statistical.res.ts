export class StatisticalRes {
  revenue!: number;
  newUsers!: number;
  newTutors!: number;
  newCourses!: number;
  coursesPurchased!: number;
  courseRatings!: number;
  averageRating!: number;

  revenuePercentage!: number;
  newUserPercentage!: number;
  newCoursesPercentage!: number;
  newTutorPercentage!: number;
  coursesPurchasedPercentage!: number;
  courseRatingsPercentage!: number;
  averageRatingPercentage!: number;

  //Import
  newTutorRequest!: number;
  newTutorRequestPercentage!: number;
  newClassActive!: number;
  newClassActivePercentage!: number;
  classroomRating!: number;
  classroomRatingPercentage!: number;
  totalManagePayment: number;
  totalManagePaymentPercentage: number;
  constructor(data: {
    revenue: number;
    newUsers: number;
    newTutors: number;
    // newCourses: number;
    // coursesPurchased: number;
    // courseRatings: number;
    // averageRating: number;
    revenuePercentage: number;
    newUserPercentage: number;
    // newCoursesPercentage: number;
    newTutorPercentage: number;
    // coursesPurchasedPercentage: number;
    // courseRatingsPercentage: number;
    // averageRatingPercentage: number;

    //Import
    newTutorRequest: number;
    newTutorRequestPercentage: number;
    newClassActive: number;
    newClassActivePercentage: number;
    classroomRating: number;
    classroomRatingPercentage: number;
    totalManagePayment: number;
    totalManagePaymentPercentage: number;
  }) {
    this.revenue = data.revenue;
    this.newUsers = data.newUsers;
    this.newTutors = data.newTutors;
    // this.coursesPurchased = data.coursesPurchased;
    // this.courseRatings = data.courseRatings;
    // this.averageRating = data.averageRating;
    this.revenuePercentage = data.revenuePercentage;
    this.newUserPercentage = data.newUserPercentage;
    // this.newCoursesPercentage = data.newCoursesPercentage;
    this.newTutorPercentage = data.newTutorPercentage;
    // this.coursesPurchasedPercentage = data.coursesPurchasedPercentage;
    // this.courseRatingsPercentage = data.courseRatingsPercentage;
    // this.averageRatingPercentage = data.averageRatingPercentage;
    this.newTutorRequest = data.newTutorRequest;
    this.newTutorRequestPercentage = data.newTutorRequestPercentage;
    this.newClassActive = data.newClassActive;
    this.newClassActivePercentage = data.newClassActivePercentage;
    this.classroomRating = data.classroomRating;
    this.classroomRatingPercentage = data.classroomRatingPercentage;
    this.totalManagePayment = data.totalManagePayment;
    this.totalManagePaymentPercentage = data.totalManagePaymentPercentage;
  }
}
