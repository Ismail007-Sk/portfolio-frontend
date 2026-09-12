// achievement.types.ts

// Response/Entity payload matching your API/Database response
export type Achievement = {
  id: string;
  title: string;
  category: string | null;
  issuer: string | null;
  achievement_date: string | null;
  description: string | null;
  achievement_url: string | null;
  icon_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// Input payload for creating an achievement (frontend form contract)
export type CreateAchievementData = {
  title: string;
  category?: string;
  issuer?: string;
  achievementDate?: string;
  description?: string;
  achievementUrl?: string;
  displayOrder?: number;
  icon?: File | null;
};

// Input payload for updating an achievement
export type UpdateAchievementData = Partial<CreateAchievementData>;