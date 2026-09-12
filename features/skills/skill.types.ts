export type Skill = {
  id: string;
  name: string;
  category: string;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateSkillData = {
  name: string;
  category: string;
  icon?: File | null;
};

export type UpdateSkillData = Partial<CreateSkillData>;