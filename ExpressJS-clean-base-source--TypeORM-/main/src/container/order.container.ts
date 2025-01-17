import { OrderController } from '@/controller/order.controller';
import { OrderService } from '@/service/order.service';
import { Order } from '@/models/order.model';
import { OrderRepository } from '@/repository/order.repository';
import { IOrderService } from '@/service/interface/i.order.service';
import { IOrderRepository } from '@/repository/interface/i.order.repository';
import { BaseContainer } from '@/container/base.container';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { valueConfigRepository } from './value_config.container';

class OrderContainer extends BaseContainer {
  constructor() {
    super(Order);
    this.container.bind<IOrderService<Order>>('OrderService').to(OrderService);
    this.container.bind<IOrderRepository<Order>>('OrderRepository').to(OrderRepository);
    this.container.bind<OrderController>(OrderController).toSelf();

    //Import
    this.container.bind<IValueConfigRepository<any>>('ValueConfigRepository').toConstantValue(valueConfigRepository);
  }

  export() {
    const orderController = this.container.get<OrderController>(OrderController);
    const orderService = this.container.get<IOrderService<any>>('OrderService');
    const orderRepository = this.container.get<IOrderRepository<any>>('OrderRepository');

    return { orderController, orderService, orderRepository };
  }
}

const orderContainer = new OrderContainer();
const { orderController, orderService, orderRepository } = orderContainer.export();
export { orderController, orderService, orderRepository };
