import { GetVnpUrl } from '@/dto/payment/get-vnp-url.res';
import { SendEmailParams } from '@/dto/send-email/send-email-params.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { OrderStatus } from '@/enums/order-status.enum';
import { Order } from '@/models/order.model';
import { Payment } from '@/models/payment.model';
import { User } from '@/models/user.model';
import { ValueConfig } from '@/models/value_config.model';
import { IOrderRepository } from '@/repository/interface/i.order.repository';
import { IPaymentRepository } from '@/repository/interface/i.payment.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IPaymentService } from '@/service/interface/i.payment.service';
import { sendEmail } from '@/utils/email/email-sender.util';
import BaseError from '@/utils/error/base.error';
import { createVNPayUrl } from '@/utils/vnpay/create-pay-url.util';
import ejs from 'ejs';
import { inject, injectable } from 'inversify';
import path from 'path';
import axios from 'axios';
import { SearchDataDto } from '@/dto/search-data.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchUtil } from '@/utils/search.util';

const EMAIL_API_URL: any = process.env.EMAIL_API_URL;
const X_SECRET_KEY: any = process.env.X_SECRET_KEY;

@injectable()
export class PaymentService extends BaseCrudService<Payment> implements IPaymentService<Payment> {
  private paymentRepository: IPaymentRepository<Payment>;
  private orderRepository: IOrderRepository<Order>;
  private valueConfigRepository: IValueConfigRepository<ValueConfig>;
  private userRepository: IUserRepository<User>;

  constructor(
    @inject('PaymentRepository') paymentRepository: IPaymentRepository<Payment>,
    @inject('OrderRepository') orderRepository: IOrderRepository<Order>,
    @inject('ValueConfigRepository') valueConfigRepository: IValueConfigRepository<ValueConfig>,
    @inject('UserRepository') userRepository: IUserRepository<User>
  ) {
    super(paymentRepository);
    this.paymentRepository = paymentRepository;
    this.orderRepository = orderRepository;
    this.valueConfigRepository = valueConfigRepository;
    this.userRepository = userRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Order>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const orders = await this.orderRepository.findMany({
      filter: { status: OrderStatus.PAID, ...where },
      order: order,
      relations: ['payment', 'items', 'user'],
      paging: paging
    });

    const total = await this.orderRepository.count({
      filter: { status: OrderStatus.PAID, ...where }
    });

    return new PagingResponseDto(total, orders);
  }

  async getMyPayment(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Order>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const orders = await this.orderRepository.findMany({
      filter: { userId: userId, ...where },
      order: order,
      relations: ['payment', 'items', 'user'],
      paging: paging
    });

    const total = await this.orderRepository.count({
      filter: { userId: userId, ...where }
    });

    return new PagingResponseDto(total, orders);
  }

  async sendEmailViaApi(params: SendEmailParams): Promise<void> {
    const response = await axios.post(
      EMAIL_API_URL,
      {
        from: params.from,
        to: { emailAddresses: params.to.emailAddress },
        subject: params.subject,
        html: params.html
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-SECRET-KEY': X_SECRET_KEY
        }
      }
    );
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findOne({
      filter: { orderId },
      relations: ['payment']
    });

    if (!order) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy đơn hàng');
    }

    order.status = status;

    if (order.payment) {
      order.payment.paymentStatus = false;
      await this.paymentRepository.save(order.payment);
    }

    await this.orderRepository.save(order);
  }

  async handleVNPayReturn(vnp_Params: any): Promise<void> {
    const vnp_ResponseCode = vnp_Params['vnp_ResponseCode']; // Mã trạng thái giao dịch

    // Kiểm tra trạng thái giao dịch
    if (vnp_ResponseCode !== '00') {
      throw new BaseError(ErrorCode.VALIDATION_ERROR, 'Giao dịch không thành công. Mã lỗi: ' + vnp_ResponseCode);
    }

    const orderId = vnp_Params['vnp_TxnRef'];
    const amount = Number(vnp_Params['vnp_Amount']) / 100;
    const bankCode = vnp_Params['vnp_BankCode'];
    const cardType = vnp_Params['vnp_CardType'];
    const orderInfo = vnp_Params['vnp_OrderInfo'];
    delete vnp_Params['vnp_BankCode'];
    delete vnp_Params['vnp_CardType'];
    delete vnp_Params['vnp_OrderInfo'];
    delete vnp_Params['vnp_TxnRef'];
    delete vnp_Params['vnp_Amount'];
    const paycheckInfo = vnp_Params;

    const order = await this.orderRepository.findOne({
      filter: {
        orderId: orderId
      },
      relations: ['payment', 'items', 'user']
    });

    if (!order) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy gói thanh toán');
    }

    const payment = order.payment;

    if (!payment) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy gói thanh toán');
    }

    if (payment.amount !== amount) {
      throw new BaseError(
        ErrorCode.VALIDATION_ERROR,
        'Số tiền không khớp, phải trả ' + payment.amount + ' nhưng đã trả ' + amount
      );
    }

    const valueConfig = await this.valueConfigRepository.findOne({
      filter: {
        price: payment.amount
      }
    });

    if (!valueConfig) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy cấu hình giá trị');
    }

    const user = order.user;

    if (!user) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy thông tin người dùng');
    }

    // Cộng coin vào tài khoản user
    user.coin += valueConfig.coinConfig;

    // Lưu thông tin user sau khi cộng coin
    await this.userRepository.save(user);

    payment.paymentStatus = true;
    payment.payInfo = {
      bankCode,
      cardType,
      orderInfo,
      paycheckInfo
    };

    await this.paymentRepository.save(payment);

    //Update status of order
    order.status = OrderStatus.PAID;

    await this.orderRepository.save(order);

    //Send success email
    const userEmail = order.customerEmail;
    if (userEmail) {
      const rootDir = process.cwd();
      const emailTemplatePath = path.join(rootDir, 'src/utils/email/success-email-payment.util.ejs');
      const emailContent = await ejs.renderFile(emailTemplatePath, {
        amount: payment.amount
      });
      await sendEmail({
        from: {
          name: 'GiaSuVLU'
        },
        to: { emailAddress: [userEmail] },
        subject: 'Thanh toán thành công',
        html: emailContent
      });
    }

    return;
  }

  async getVnpUrl(paymentId: string, ipAddr: string): Promise<GetVnpUrl> {
    const payment = await this.paymentRepository.findOne({
      filter: {
        paymentId: paymentId
      },
      relations: ['order']
    });

    if (!payment) {
      throw new BaseError(ErrorCode.NF_01, 'Payment not found');
    }

    //Get total amount
    const total = payment.amount;

    //Get orderId
    const orderId = payment.order.orderId;

    //Get url from VNPAY
    const payUrl = createVNPayUrl(total, ipAddr, orderId);

    return new GetVnpUrl(payUrl);
  }
}
