export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  icon: string;
  whatWeOffer?: string[];
  benefits?: string[];
  process?: string[];
  portfolio?: {
    images?: string[];
    videos?: string[];
  };
}