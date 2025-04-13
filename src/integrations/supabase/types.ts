export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      internships_raw: {
        Row: {
          apply: string | null
          company: string | null
          company_industry: string | null
          company_size: string | null
          created_at: string | null
          date: string | null
          graduate_time: string | null
          hire_time: string | null
          location: string | null
          qualifications: string | null
          salary: string | null
          title: string | null
          work_model: string | null
        }
        Insert: {
          apply?: string | null
          company?: string | null
          company_industry?: string | null
          company_size?: string | null
          created_at?: string | null
          date?: string | null
          graduate_time?: string | null
          hire_time?: string | null
          location?: string | null
          qualifications?: string | null
          salary?: string | null
          title?: string | null
          work_model?: string | null
        }
        Update: {
          apply?: string | null
          company?: string | null
          company_industry?: string | null
          company_size?: string | null
          created_at?: string | null
          date?: string | null
          graduate_time?: string | null
          hire_time?: string | null
          location?: string | null
          qualifications?: string | null
          salary?: string | null
          title?: string | null
          work_model?: string | null
        }
        Relationships: []
      }
      job_market: {
        Row: {
          application_deadline: string | null
          company_name: string | null
          company_size: string | null
          education_requirement: string | null
          experience_required: string | null
          job_id: string | null
          job_location: string | null
          job_portal: string | null
          job_title: string | null
          job_type: string | null
          number_of_applicants: number | null
          posted_date: string | null
          remote_onsite: string | null
          salary_range: string | null
          skills_required: string | null
        }
        Insert: {
          application_deadline?: string | null
          company_name?: string | null
          company_size?: string | null
          education_requirement?: string | null
          experience_required?: string | null
          job_id?: string | null
          job_location?: string | null
          job_portal?: string | null
          job_title?: string | null
          job_type?: string | null
          number_of_applicants?: number | null
          posted_date?: string | null
          remote_onsite?: string | null
          salary_range?: string | null
          skills_required?: string | null
        }
        Update: {
          application_deadline?: string | null
          company_name?: string | null
          company_size?: string | null
          education_requirement?: string | null
          experience_required?: string | null
          job_id?: string | null
          job_location?: string | null
          job_portal?: string | null
          job_title?: string | null
          job_type?: string | null
          number_of_applicants?: number | null
          posted_date?: string | null
          remote_onsite?: string | null
          salary_range?: string | null
          skills_required?: string | null
        }
        Relationships: []
      }
      job_markets: {
        Row: {
          application_deadline: string | null
          company_name: string | null
          company_size: string | null
          education_requirement: string | null
          experience_required: string | null
          job_id: string | null
          job_location: string | null
          job_portal: string | null
          job_title: string | null
          job_type: string | null
          number_of_applicants: number | null
          posted_date: string | null
          remote_onsite: string | null
          salary_range: string | null
          skills_required: string | null
        }
        Insert: {
          application_deadline?: string | null
          company_name?: string | null
          company_size?: string | null
          education_requirement?: string | null
          experience_required?: string | null
          job_id?: string | null
          job_location?: string | null
          job_portal?: string | null
          job_title?: string | null
          job_type?: string | null
          number_of_applicants?: number | null
          posted_date?: string | null
          remote_onsite?: string | null
          salary_range?: string | null
          skills_required?: string | null
        }
        Update: {
          application_deadline?: string | null
          company_name?: string | null
          company_size?: string | null
          education_requirement?: string | null
          experience_required?: string | null
          job_id?: string | null
          job_location?: string | null
          job_portal?: string | null
          job_title?: string | null
          job_type?: string | null
          number_of_applicants?: number | null
          posted_date?: string | null
          remote_onsite?: string | null
          salary_range?: string | null
          skills_required?: string | null
        }
        Relationships: []
      }
      navigation_link: {
        Row: {
          link_text: string | null
          position: string | null
          url: string | null
        }
        Insert: {
          link_text?: string | null
          position?: string | null
          url?: string | null
        }
        Update: {
          link_text?: string | null
          position?: string | null
          url?: string | null
        }
        Relationships: []
      }
      navigation_links: {
        Row: {
          link_text: string | null
          position: number | null
          url: string | null
        }
        Insert: {
          link_text?: string | null
          position?: number | null
          url?: string | null
        }
        Update: {
          link_text?: string | null
          position?: number | null
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          saved_internships: string[] | null
          username: string | null
        }
        Insert: {
          id: string
          saved_internships?: string[] | null
          username?: string | null
        }
        Update: {
          id?: string
          saved_internships?: string[] | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
