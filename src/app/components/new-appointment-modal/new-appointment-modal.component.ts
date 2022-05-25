import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { filter, map, Observable, of, skip, tap } from 'rxjs';
import { MessageTypeEnum } from 'src/app/models/messageTypeEnum';
import { Schedule } from 'src/app/models/schedule';
import { Specialty } from 'src/app/models/specialty';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-new-appointment-modal',
  templateUrl: './new-appointment-modal.component.html',
  styleUrls: ['./new-appointment-modal.component.scss'],
})
export class NewAppointmentModalComponent implements OnInit {
  specialties: Specialty[] = [];
  doctors: Specialty[] = [];

  schedules: Schedule[] = [];
  days: string[] = [];
  hours: string[] = [];

  selectedSchedule = -1;

  private readonly INITIAL_VALUES = {
    specialty: 'Especialidade',
    doctor: 'Médico',
    day: 'Data',
    hour: 'Hora',
  };

  newAppointmentFG = this.fb.group({
    specialty: [this.INITIAL_VALUES['specialty']],
    doctor: [this.INITIAL_VALUES['doctor']],
    day: [this.INITIAL_VALUES['day']],
    hour: [this.INITIAL_VALUES['hour']],
  });

  constructor(
    private uiService: UiService,
    public appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.newAppointmentFG
      .get('specialty')
      ?.valueChanges.pipe(filter((v) => this.isAValidValue(v)))
      .subscribe(async (specialtyName) => {
        this.clearAndDisable(['doctor', 'day', 'hour']);
        this.enable(['doctor']);
        this.doctors = (await this.appointmentService.getDoctors()).filter(
          (s) => s.specialty.name === specialtyName
        );
      });

    this.newAppointmentFG
      .get('doctor')
      ?.valueChanges.pipe(filter((v) => this.isAValidValue(v)))
      .subscribe(async (doctorName) => {
        this.clearAndDisable(['day', 'hour']);
        this.enable(['day']);
        this.schedules = (await this.appointmentService.getSchedules()).filter(
          (s) => s.doctor.name === doctorName
        );
        this.days = this.schedules.map((s) => s.day);
      });

    this.newAppointmentFG
      .get('day')
      ?.valueChanges.pipe(filter((v) => this.isAValidValue(v)))
      .subscribe((day) => {
        this.enable(['hour']);
        this.hours =
          this.schedules.filter((s) => s.day === day)[0]?.slots ?? [];
      });

    this.newAppointmentFG
      .get('hour')
      ?.valueChanges.pipe(filter((v) => this.isAValidValue(v)))
      .subscribe((_) => {
        this.selectedSchedule = this.schedules.find(
          (s) => s.day === this.newAppointmentFG.get('day')?.value
        )?.id!;
      });
  }

  async ngOnInit(): Promise<void> {
    this.clearAndDisable(['doctor', 'day', 'hour']);
    this.specialties = await this.appointmentService.getSpecialties();
  }

  closeModal(update = false) {
    const isInProgress = Object.keys(this.newAppointmentFG.controls).some(
      (key) => {
        return this.isAValidValue(this.newAppointmentFG.get(key)?.value);
      }
    );

    if (
      !isInProgress ||
      update ||
      confirm('Tem certeza de que deseja descartar as alterações?')
    ) {
      this.uiService.newAppointmentModalSubject.next({
        open: false,
        update,
      });
    }
  }

  clearAndDisable(fields: string[]) {
    fields.forEach((field) => {
      this.newAppointmentFG.get(field)?.disable();
      this.newAppointmentFG
        .get(field)
        ?.setValue((this.INITIAL_VALUES as any)[field]);
    });
  }

  enable(fields: string[]) {
    fields.forEach((field) => {
      this.newAppointmentFG.get(field)?.enable();
    });
  }

  isSubmitButtonDisabled(): boolean {
    return !Object.keys(this.newAppointmentFG.controls).every((key) => {
      return this.isAValidValue(this.newAppointmentFG.get(key)?.value);
    });
  }

  isAValidValue(value: string): boolean {
    return !Object.values(this.INITIAL_VALUES).includes(value);
  }

  async addAppointment() {
    await this.appointmentService.addAppointment({
      scheduleId: this.selectedSchedule,
      hour: this.newAppointmentFG.get('hour')?.value as string,
    });
    this.uiService.toastSubject.next({
      message: 'Agendamento Feito com Sucesso!',
      messageType: MessageTypeEnum.SUCCESS,
    });
    this.closeModal(true);
  }
}
