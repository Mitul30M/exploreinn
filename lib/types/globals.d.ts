export {};

declare global {
  export type SessionClaims = {
    userDB_id: string;
  };

  export type PublicMetadataType = {
    userDB_id?: string;
    onboardingComplete?: boolean;
  };

  export type MessageType = {
    userDB_id: string;
    message: string;
  };

  export type SearchParams = Promise<{
    [key: string]: string | string[] | undefined;
  }>;

  export type Params = Promise<{
    slug: string;
  }>;
}
