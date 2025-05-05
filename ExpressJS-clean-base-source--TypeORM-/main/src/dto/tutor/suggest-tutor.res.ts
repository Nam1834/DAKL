import { Expose } from 'class-transformer';

export class SuggestedTutor {
  @Expose()
  userId!: string; // ID của gia sư

  @Expose()
  tutorId!: string; // ID của người dùng (tutor)

  @Expose()
  fullName!: string; // Họ tên gia sư

  @Expose()
  gender!: string; // Giới tính của gia sư

  @Expose()
  subject!: string; // Môn học mà gia sư giảng dạy

  @Expose()
  teachingPlace!: string; // Nơi gia sư dạy (OFFLINE/ONLINE)

  @Expose()
  dateTimeLearn!: string[]; // Lịch dạy của gia sư

  @Expose()
  rating!: number; // Điểm trung bình đánh giá của gia sư

  @Expose()
  matchingScore!: number; // Điểm phù hợp được tính từ thuật toán

  @Expose()
  profilePicture!: string;
}
