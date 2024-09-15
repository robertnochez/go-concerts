

// date of event, price, city and state, platform found on
export type TicketDataType = {
  name: string; // this is name of the event
  url: string;
  localDate: string; // date of the event
  price: string;
  //city: string;
  // state: string;
  platform: string;
}

interface TicketMasterEvent {
    _links?: Record<string, any>;
    _embedded?: Record<string, any>;
    type?: string;
    distance?: number;
    units?: string;
    location?: Record<string, any>;
    id?: string;
    locale?: string;
    name?: string;
    description?: string;
    additionalInfo?: string;
    url?: string;
    images?: string[];
    dates?: Record<string, any>;
    sales?: Record<string, any>;
    info?: string;
    pleaseNote?: string;
    priceRanges?: Array<{
      min?: number;
      max?: number;
      currency?: string;
      type?: string;
    }>;
    promoter?: Record<string, any>;
    promoters?: Record<string, any>[];
    outlets?: Record<string, any>[];
    productType?: string;
    products?: Record<string, any>[];
    seatmap?: Record<string, any>;
    accessibility?: Record<string, any>;
    ticketLimit?: Record<string, any>;
    classifications?: Array<{
      genre?: string;
      subGenre?: string;
      segment?: string;
      subSegment?: string;
    }>;
    place?: Record<string, any>;
    externalLinks?: Record<string, any>;
    test?: boolean;
    aliases?: string[];
    localizedAliases?: Record<string, any>;
  }
  
export type TicketMasterAllEventsDataType = TicketMasterEvent[];