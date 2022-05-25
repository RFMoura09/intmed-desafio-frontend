import { Specialty } from './specialty';

export interface Doctor {
  id: number;
  crm: string;
  name: string;
  specialty: Specialty;
}
