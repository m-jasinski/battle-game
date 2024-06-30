import { Person, ResponseData, Starship } from '../api/api.service';

export const mockStarshipData: Starship = {
  consumables: '2 months',
  cost_in_credits: '100000',
  crew: '4',
  hyperdrive_rating: '0.5',
  length: '34.37',
  model: 'YT-1300 light freighter',
  name: 'Millennium Falcon',
  passengers: '6',
};

export const mockPersonData: Person = {
  birth_year: '19BBY',
  eye_color: 'blue',
  gender: 'male',
  hair_color: 'blond',
  height: '172',
  mass: '77',
  skin_color: 'fair',
  name: 'Luke Skywalker',
};

export const mockResponsePersonPlayer1: ResponseData<Person> = {
  result: {
    properties: {
      ...mockPersonData,
    },
  },
};

export const mockResponsePersonPlayer2: ResponseData<Person> = {
  result: {
    properties: {
      ...mockPersonData,
      mass: '100',
    },
  },
};

export const mockResponseStarshipPlayer1: ResponseData<Starship> = {
  result: {
    properties: {
      ...mockStarshipData,
    },
  },
};

export const mockResponseStarshipPlayer2: ResponseData<Starship> = {
  result: {
    properties: {
      ...mockStarshipData,
      crew: '100',
    },
  },
};
