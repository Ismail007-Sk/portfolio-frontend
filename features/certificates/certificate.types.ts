// certificate.types.ts

// Database / API Response Entity
export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  issuer_icon_url: string | null;
  certificate_type: string | null;
  certificate_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// Frontend Form Payload for Creation (accepts File objects or direct URL strings)
export type CreateCertificationData = {
  title: string;
  issuer: string;
  issueDate: string;
  certificateType?: string;
  displayOrder?: number;
  // Uploaded files matching Multer field names: 'certificate' and 'issuerIcon'
  certificate?: File | string | null;
  issuerIcon?: File | string | null;
};

// Frontend Form Payload for Updates
export type UpdateCertificationData = Partial<CreateCertificationData>;