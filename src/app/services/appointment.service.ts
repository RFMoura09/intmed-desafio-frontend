import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  exhaustMap,
  firstValueFrom,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  skip,
  Subject,
  throttleTime,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';
import { AppointmentDTO } from '../models/appointmentDTO';
import { Doctor } from '../models/Doctor';
import { Schedule } from '../models/schedule';
import { Specialty } from '../models/specialty';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  mapToSpecialty(specialty: any): Specialty {
    return {
      id: specialty.id,
      name: specialty.nome,
    };
  }

  mapToDoctor(doctor: any): Doctor {
    return {
      id: doctor.id,
      name: doctor.nome,
      crm: doctor.crm,
      specialty: this.mapToSpecialty(doctor.especialidade),
    };
  }

  mapToAppointment(appointment: any): Appointment {
    return {
      id: appointment.id,
      day: appointment.dia,
      hour: appointment.horario,
      date: appointment.data_agendamento,
      doctor: this.mapToDoctor(appointment.medico),
    };
  }

  mapToSchedule(schedule: any): Schedule {
    return {
      id: schedule.id,
      doctor: this.mapToDoctor(schedule.medico),
      day: schedule.dia,
      slots: schedule.horarios,
    };
  }

  async getSpecialties(): Promise<Specialty[]> {
    return await firstValueFrom<Specialty[]>(
      this.http
        .get<any>(environment.apiUrl + '/especialidades')
        .pipe(
          map((specialties) =>
            specialties.map((s: any) => this.mapToSpecialty(s))
          )
        )
    );
  }

  async getDoctors(): Promise<Doctor[]> {
    return await firstValueFrom<Doctor[]>(
      this.http
        .get<any>(environment.apiUrl + '/medicos')
        .pipe(map((doctors) => doctors.map((d: any) => this.mapToDoctor(d))))
    );
  }

  async getSchedules(): Promise<Schedule[]> {
    return await firstValueFrom<Schedule[]>(
      this.http
        .get<any>(environment.apiUrl + '/agendas')
        .pipe(
          map((schedules) => schedules.map((s: any) => this.mapToSchedule(s)))
        )
    );
  }

  async getAppointments(): Promise<Appointment[]> {
    return await firstValueFrom<Appointment[]>(
      this.http
        .get<any>(environment.apiUrl + '/consultas')
        .pipe(
          map((appointments) =>
            appointments.map((a: any) => this.mapToAppointment(a))
          )
        )
    );
  }

  async addAppointment(appointmentDTO: AppointmentDTO) {
    await firstValueFrom(
      this.http.post<any>(environment.apiUrl + '/consultas', {
        agenda_id: appointmentDTO.scheduleId,
        horario: appointmentDTO.hour,
      })
    );
  }

  async deleteAppointment(appointmentId: number) {
    await firstValueFrom(
      this.http.delete<any>(environment.apiUrl + '/consultas/' + appointmentId)
    );
  }
}
