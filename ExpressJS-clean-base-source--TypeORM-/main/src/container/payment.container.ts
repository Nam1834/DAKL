import { PaymentController } from '@/controller/payment.controller';
import { PaymentService } from '@/service/payment.service';
import { Payment } from '@/models/payment.model';
import { PaymentRepository } from '@/repository/payment.repository';
import { IPaymentService } from '@/service/interface/i.payment.service';
import { IPaymentRepository } from '@/repository/interface/i.payment.repository';
import { BaseContainer } from '@/container/base.container';
import { IOrderRepository } from '@/repository/interface/i.order.repository';
import { orderRepository } from './order.container';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { valueConfigRepository } from './value_config.container';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { userRepository } from './user.container';

class PaymentContainer extends BaseContainer {
  constructor() {
    super(Payment);
    this.container.bind<IPaymentService<Payment>>('PaymentService').to(PaymentService);
    this.container.bind<IPaymentRepository<Payment>>('PaymentRepository').to(PaymentRepository);
    this.container.bind<PaymentController>(PaymentController).toSelf();

    //Import
    this.container.bind<IOrderRepository<any>>('OrderRepository').toConstantValue(orderRepository);
    this.container.bind<IValueConfigRepository<any>>('ValueConfigRepository').toConstantValue(valueConfigRepository);
    this.container.bind<IUserRepository<any>>('UserRepository').toConstantValue(userRepository);
  }

  export() {
    const paymentController = this.container.get<PaymentController>(PaymentController);
    const paymentService = this.container.get<IPaymentService<any>>('PaymentService');
    const paymentRepository = this.container.get<IPaymentRepository<any>>('PaymentRepository');

    return { paymentController, paymentService, paymentRepository };
  }
}

const paymentContainer = new PaymentContainer();
const { paymentController, paymentService, paymentRepository } = paymentContainer.export();
export { paymentController, paymentService, paymentRepository };
