import { Doctor } from './Doctor';

export interface Schedule {
  id: number;
  doctor: Doctor;
  day: string;
  slots: string[];
}
