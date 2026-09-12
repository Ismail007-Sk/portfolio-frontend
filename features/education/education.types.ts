// education.types.ts

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
};

export type CreateEducationData = {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
  displayOrder?: number;
};

export type UpdateEducationData = Partial<CreateEducationData>;