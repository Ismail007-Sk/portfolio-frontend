// profile.types.ts

export type AvailabilityStatus =
  | "available_for_jobs"
  | "available_for_freelance"
  | "available_for_both"
  | "not_available";

// =================================
// Profile — API/DB response
// =================================

export type Profile = {
  id: string;

  name: string;
  headline: string | null;
  bio: string | null;
  about_me: string | null;

  email: string;
  phone_number: string | null;

  linkedin_url: string | null;
  github_url: string | null;

  profile_pic_url: string | null;

  availability_status: AvailabilityStatus;

  cv_url: string | null;

  created_at: string;
  updated_at: string;
};


// =================================
// Create Profile — multipart input
// =================================

export type CreateProfileData = {
  name: string;
  headline?: string;
  bio?: string;
  aboutMe?: string;

  email: string;
  phoneNumber?: string;

  linkedinUrl?: string;
  githubUrl?: string;

  availabilityStatus?: AvailabilityStatus;

  cv?: File | null;
  profilePic?: File | null;
};


// =================================
// Update Profile — multipart input
// =================================

export type UpdateProfileData = Partial<CreateProfileData>;