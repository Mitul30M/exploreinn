import { Mail } from "@prisma/client";

export {};

declare global {
  export type SessionClaims = {
    userDB_id: string;
  };

  export type PublicMetadataType = {
    userDB_id?: string;
    onboardingComplete?: boolean;
  };

  export type PrivateMetadataType = {
    stripeId?: string;
  };

  export type MessageType = {
    userDB_id: string;
    message: string;
  };

  export type SearchParams = Promise<{
    [key: string]: string | string[] | undefined;
  }>;

  export type Params = Promise<{
    userId: string;
    listingId: string;
    bookingId: string;
    roomId: string;
  }>;

  export type StripeCheckoutSessionMetaData = {
    userID: string;
    listingID: string;
    bookingDate: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    nights: string;
    rooms: string;
    extras: string;
    taxes: string;
    totalWithoutTaxes: string;
    tax: string;
    totalPayable: string;
    isOfferApplied?: string;
    offerId?: string;
  };

  export type TMails = Mail & {
    sender?: {
      firstName: string;
      lastName: string;
      email: string;
      profileImg: string | null;
    };
    receiver: {
      firstName: string;
      lastName: string;
      email: string;
      profileImg: string | null;
    };
    listing?: {
      id: string;
      name: string;
      email: string;
      coverImage: string;
    };
  };
}
