export type WorkStatus = "remote" | "offline" | "hybrid";

export type Experience = {
  duration: import("react").JSX.Element;
  id: string;
  company: string;
  role: string;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  technologies: string[];
  display_order: number;
  icon_url: string | null;
  work_status: WorkStatus | null;
  responsibilities: string[];
  created_at: string;
  updated_at: string;
};

export type CreateExperienceData = {
  company: string;
  role: string;
  employmentType?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string;
  technologies?: string[];
  displayOrder?: number;
  workStatus?: WorkStatus;
  responsibilities?: string[];
  icon?: File | null; // Transmitted as file upload
};

export type UpdateExperienceData = Partial<CreateExperienceData>;