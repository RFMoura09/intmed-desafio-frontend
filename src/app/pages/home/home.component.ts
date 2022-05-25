import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { MessageTypeEnum } from 'src/app/models/messageTypeEnum';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(
    private uiService: UiService,
    public authService: AuthService,
    public appointmentService: AppointmentService
  ) {
    this.uiService.newAppointmentModalSubject.subscribe(({ update }) => {
      if (update) {
        this.update();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.update();
  }

  async update() {
    this.appointments = await this.appointmentService.getAppointments();
  }

  openNewAppointmentModal() {
    this.uiService.newAppointmentModalSubject.next({
      open: true,
      update: false,
    });
  }

  async deleteAppointment(id: number) {
    if (confirm('Tem certeza de que deseja desmarcar?')) {
      await this.appointmentService.deleteAppointment(id);
      await this.update();
      this.uiService.toastSubject.next({
        message: 'Consulta desmarcada com sucesso!',
        messageType: MessageTypeEnum.SUCCESS,
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
