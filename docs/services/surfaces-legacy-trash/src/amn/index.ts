// AMN Surfaces - Transportation & Mobility Services
// Clean Architecture: Mobile/Web separation (shared not yet implemented)

export * from './mobile';
export * from './web';

// AMN Domain Types (re-export from domain-types main entry)
export type {
  Trip,
  TripOffer,
  Captain,
  CaptainTrip,
  CaptainEarnings,
  Negotiation,
  CreateTripRequest,
  AcceptTripOfferRequest,
  CreateTripOfferRequest,
  UpdateTripStatusRequest,
  RateTripRequest,
  SOSRequest,
  PlacesAutocompleteRequest,
  PlacesAutocompleteResponse,
  TripResponse
} from '@bthwani/domain-types';
