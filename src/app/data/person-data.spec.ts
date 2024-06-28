import { Person } from '../api/api.service';
import { getPersonInitialData } from './person-data';

const mockPersonData: Person = {
  birth_year: '',
  eye_color: '',
  gender: '',
  hair_color: '',
  height: '',
  mass: '',
  skin_color: '',
  name: '',
};

describe('Person Data Helper', () => {
  it('should return initial Person data object', () => {
    expect(getPersonInitialData()).toEqual(mockPersonData);
  });
});
