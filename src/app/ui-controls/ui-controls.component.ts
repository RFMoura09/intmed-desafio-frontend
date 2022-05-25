import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastModel } from '../models/toastModel';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-ui-controls',
  templateUrl: './ui-controls.component.html',
  styleUrls: ['./ui-controls.component.scss'],
})
export class UiControlsComponent implements OnInit, OnDestroy {
  private _showToast = false;
  get showToast() {
    return this._showToast;
  }
  set showToast(value: boolean) {
    this._showToast = value;
    if (this._showToast) {
      setTimeout(() => (this._showToast = false), 3000);
    }
  }

  private toastSubscribe!: Subscription;

  toastContent: ToastModel | null = null;

  constructor(public uiService: UiService) {
    this.toastSubscribe = this.uiService.toastSubject.subscribe((content) => {
      this.toastContent = content;
      this.showToast = !!content && content.message !== '';
    });
  }

  ngOnDestroy(): void {
    this.toastSubscribe.unsubscribe();
  }

  ngOnInit(): void {}
}
