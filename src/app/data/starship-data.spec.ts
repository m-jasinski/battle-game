import { Starship } from '../api/api.service';
import { getStarshipInitialData } from './starship-data.';

const mockStarshipData: Starship = {
  consumables: '',
  cost_in_credits: '',
  crew: '',
  hyperdrive_rating: '',
  length: '',
  model: '',
  passengers: '',
  name: '',
};

describe('Starship Data Helper', () => {
  it('should return initial Starship data object', () => {
    expect(getStarshipInitialData()).toEqual(mockStarshipData);
  });
});
