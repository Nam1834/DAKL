import { NotificationController } from '@/controller/notification.controller';
import { NotificationService } from '@/service/notification.service';
import { Notification } from '@/models/notification.model';
import { INotificationService } from '@/service/interface/i.notification.service';
import { INotificationRepository } from '@/repository/interface/i.notification.repository';
import { BaseContainer } from '@/container/base.container';
import { NotificationRepository } from '@/repository/notification.repository';

class NotificationContainer extends BaseContainer {
  constructor() {
    super(Notification);
    this.container.bind<INotificationService<Notification>>('NotificationService').to(NotificationService);
    this.container.bind<INotificationRepository<Notification>>('NotificationRepository').to(NotificationRepository);
    this.container.bind<NotificationController>(NotificationController).toSelf();
  }

  export() {
    const notificationController = this.container.get<NotificationController>(NotificationController);
    const notificationService = this.container.get<INotificationService<any>>('NotificationService');
    const notificationRepository = this.container.get<INotificationRepository<any>>('NotificationRepository');

    return { notificationController, notificationService, notificationRepository };
  }
}

const notificationContainer = new NotificationContainer();
const { notificationController, notificationService, notificationRepository } = notificationContainer.export();
export { notificationController, notificationService, notificationRepository };
