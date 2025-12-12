export interface UserRole {
  id: string;
  user_id: number;
  role_id: number;
  startAt: string;
  endAt: string;
  created_at?: string;
  updated_at?: string;
}
