export type FormState = {
  type?: "success" | "error" ;
  message: string;
  fields?: Record<string, unknown>;
  issues?: string[];
};
