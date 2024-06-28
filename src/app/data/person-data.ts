import { Person } from '../api/api.service';

export function getPersonInitialData(): Person {
  return {
    birth_year: '',
    eye_color: '',
    gender: '',
    hair_color: '',
    height: '',
    mass: '',
    skin_color: '',
    name: '',
  };
}
