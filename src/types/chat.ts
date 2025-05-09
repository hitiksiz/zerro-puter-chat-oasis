
export interface Message {
  sender: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}
