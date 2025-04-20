import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Email } from '@/models/email.model';
import { IEmailService } from '@/service/interface/i.email.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class EmailController {
public common: IBaseCrudController<Email>;
private emailService: IEmailService<Email>;
constructor(
@inject('EmailService') emailService: IEmailService<Email>,
@inject(ITYPES.Controller) common: IBaseCrudController<Email>
) {
this.emailService = emailService;
this.common = common;
}
}