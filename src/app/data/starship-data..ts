import { Starship } from '../api/api.service';

export function getStarshipInitialData(): Starship {
  return {
    consumables: '',
    cost_in_credits: '',
    crew: '',
    hyperdrive_rating: '',
    length: '',
    model: '',
    passengers: '',
    name: '',
  };
}
