import { SubmitTestDto } from '@/dto/test/submit-test.dto';
import { TestQuestion } from '@/models/test_question.model';
import { TestResult } from '@/models/test_result.model';
import { User } from '@/models/user.model';
import { ITestQuestionRepository } from '@/repository/interface/i.test_question.repository';
import { ITestResultRepository } from '@/repository/interface/i.test_result.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITestResultService } from '@/service/interface/i.test_result.service';
import { inject, injectable } from 'inversify';

@injectable()
export class TestResultService extends BaseCrudService<TestResult> implements ITestResultService<TestResult> {
  private testResultRepository: ITestResultRepository<TestResult>;
  private testQuestionRepository: ITestQuestionRepository<TestQuestion>;
  private userRepository: IUserRepository<User>;

  constructor(
    @inject('TestResultRepository') testResultRepository: ITestResultRepository<TestResult>,
    @inject('TestQuestionRepository') testQuestionRepository: ITestQuestionRepository<TestQuestion>,
    @inject('UserRepository') userRepository: IUserRepository<User>
  ) {
    super(testResultRepository);
    this.testResultRepository = testResultRepository;
    this.testQuestionRepository = testQuestionRepository;
    this.userRepository = userRepository;
  }

  async submitTest(userId: string, submitTestDto: SubmitTestDto): Promise<void> {
    const user = await this.userRepository.findOne({ filter: { userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const { testId, answers } = submitTestDto;

    // Lấy danh sách câu hỏi của bài test
    const questions = await this.testQuestionRepository.findMany({ filter: { testId } });
    if (!questions.length) {
      throw new Error('Test not found or no questions available');
    }

    // Tính điểm dựa trên câu trả lời đúng
    let score = 0;
    for (const question of questions) {
      const userAnswer = answers.find((a) => a.questionId === question.testQuestionId);
      if (userAnswer && userAnswer.answer === question.correctAnswer) {
        score += 1;
      }
    }

    // Lưu kết quả vào database
    const testResult = await this.testResultRepository.create({
      data: {
        userId: userId,
        points: score,
        title: `Hoàn thành bài test!`,
        description: `Đạt ${score}/${questions.length} điểm.`
      }
    });

    await this.testResultRepository.save(testResult);
    await this.userRepository.findOneAndUpdate({
      filter: { userId },
      updateData: { totalTestPoints: score }
    });
  }

  async checkPassTest(userId: string): Promise<boolean> {
    const testResult = await this.testResultRepository.findOne({
      filter: { userId }
    });

    return Boolean(testResult);
  }
}
