import { SuggestedTutor } from './suggest-tutor.res';

export interface SuggestedTutorResponse {
  total: number; // Tổng số gia sư phù hợp
  items: SuggestedTutor[]; // Danh sách gia sư đã được tính điểm
}
