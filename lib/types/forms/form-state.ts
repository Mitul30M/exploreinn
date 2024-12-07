export type FormState = {
  type?: "success" | "error" ;
  message: string;
  fields?: Record<string, any>;
  issues?: string[];
};
