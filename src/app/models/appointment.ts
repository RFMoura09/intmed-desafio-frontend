import { Doctor } from './Doctor';

export interface Appointment {
  id: number;
  day: string;
  hour: string;
  date?: string;
  doctor: Doctor;
}
