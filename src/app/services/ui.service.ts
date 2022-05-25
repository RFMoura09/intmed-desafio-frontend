import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MessageTypeEnum } from '../models/messageTypeEnum';
import { NewAppointmentModalProps } from '../models/newAppointmentModalProps';
import { ToastModel } from '../models/toastModel';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public loaderSubject = new Subject<boolean>();

  public newAppointmentModalSubject = new Subject<NewAppointmentModalProps>();

  public toastSubject = new BehaviorSubject<ToastModel>({
    message: '',
    messageType: MessageTypeEnum.SUCCESS,
  });

  constructor() {}
}
