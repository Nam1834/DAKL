import { CreateOrderWithValueConfigIdReq } from '@/dto/order/create-order-with-value-config-id.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { Order } from '@/models/order.model';
import { OrderItem } from '@/models/order_item.model';
import { Payment } from '@/models/payment.model';
import { ValueConfig } from '@/models/value_config.model';
import { IOrderRepository } from '@/repository/interface/i.order.repository';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IOrderService } from '@/service/interface/i.order.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';

@injectable()
export class OrderService extends BaseCrudService<Order> implements IOrderService<Order> {
  private orderRepository: IOrderRepository<Order>;
  private valueConfigRepository: IValueConfigRepository<ValueConfig>;

  constructor(
    @inject('OrderRepository') orderRepository: IOrderRepository<Order>,
    @inject('ValueConfigRepository') valueConfigRepository: IValueConfigRepository<ValueConfig>
  ) {
    super(orderRepository);
    this.orderRepository = orderRepository;
    this.valueConfigRepository = valueConfigRepository;
  }

  async createOrderWithValueConfigId(requestBody: CreateOrderWithValueConfigIdReq, userId: string): Promise<Order> {
    //Get value from valueConfigId

    const valueConfig = await this.valueConfigRepository.findOne({
      filter: { valueConfigId: requestBody.valueConfigId }
    });

    if (!valueConfig) {
      throw new BaseError(ErrorCode.NOT_FOUND, `Value Config not found`);
    }

    const order = new Order();

    order.totalPrice = valueConfig.price;

    const orderItems = new Array<OrderItem>();

    const orderItem = new OrderItem();
    orderItem.valueConfig = valueConfig;
    orderItem.price = valueConfig.price;

    orderItems.push(orderItem);

    order.items = orderItems;
    order.userId = userId;
    order.customerEmail = requestBody.customerEmail;
    order.customerFullname = requestBody.customerFullname;
    order.customerPhone = requestBody.customerPhone;

    //Create payment
    const payment = new Payment();
    payment.payType = requestBody.payType;
    payment.amount = order.totalPrice;

    order.payment = payment;

    await this.orderRepository.save(order);

    return order;
  }
}
