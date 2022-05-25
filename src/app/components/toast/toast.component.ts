import { Component, Input, OnInit } from '@angular/core';
import { MessageTypeEnum } from 'src/app/models/messageTypeEnum';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Input() message = '';
  @Input() messageType: MessageTypeEnum = MessageTypeEnum.SUCCESS;

  constructor() {}

  ngOnInit(): void {}

  getColor() {
    switch (this.messageType) {
      case MessageTypeEnum.SUCCESS:
        return '#00aa64';
      case MessageTypeEnum.ERROR:
        return '#f00050';
      default:
        return '#00aa64';
    }
  }
}
