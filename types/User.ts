export type User = {
  id: number;
  email: string;
  nickName: string;
  birth: string;            // "2000-01-01"
  gender: 'MALE' | 'FEMALE' | string;
  region: 'SEOUL' | string;
  categories?: string[];    // ["공부", "운동"] 등
  profileImageUrl?: string;
  description: string;
  role: "GUEST" | string;
  createdAt: string;      
};