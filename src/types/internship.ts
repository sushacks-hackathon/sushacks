
// Define the database response type with explicit nullability
export interface SupabaseInternshipRecord {
  id?: string;
  apply: string | null;
  company: string | null;
  company_industry: string | null;
  company_size: string | null;
  created_at: string | null;
  date: string | null;
  graduate_time: string | null;
  hire_time: string | null;
  location: string | null;
  qualifications: string | null;
  salary: string | null;
  title: string | null;
  work_model: string | null;
}

// Application-specific type with guaranteed id field
export interface SavedInternship {
  id: string;
  apply: string | null;
  company: string | null;
  date: string | null;
  location: string | null;
  salary: string | null;
  title: string | null;
  work_model: string | null;
}
