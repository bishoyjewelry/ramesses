export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      creator_applications: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_design_image_urls: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_design_image_urls?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_design_image_urls?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_earnings: {
        Row: {
          commission_amount: number
          created_at: string
          creator_profile_id: string
          design_id: string | null
          id: string
          order_id: string | null
          paid_at: string | null
          period: string
          sale_amount: number
          status: Database["public"]["Enums"]["earning_status"]
          updated_at: string
        }
        Insert: {
          commission_amount: number
          created_at?: string
          creator_profile_id: string
          design_id?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          period: string
          sale_amount: number
          status?: Database["public"]["Enums"]["earning_status"]
          updated_at?: string
        }
        Update: {
          commission_amount?: number
          created_at?: string
          creator_profile_id?: string
          design_id?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          period?: string
          sale_amount?: number
          status?: Database["public"]["Enums"]["earning_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_earnings_creator_profile_id_fkey"
            columns: ["creator_profile_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          id: string
          location: string | null
          profile_image_url: string | null
          status: Database["public"]["Enums"]["creator_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          location?: string | null
          profile_image_url?: string | null
          status?: Database["public"]["Enums"]["creator_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          location?: string | null
          profile_image_url?: string | null
          status?: Database["public"]["Enums"]["creator_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_inquiries: {
        Row: {
          budget_range: string | null
          created_at: string
          description: string
          email: string
          id: string
          image_urls: string[] | null
          name: string
          phone: string | null
          piece_type: string
          status: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          description: string
          email: string
          id?: string
          image_urls?: string[] | null
          name: string
          phone?: string | null
          piece_type: string
          status?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          description?: string
          email?: string
          id?: string
          image_urls?: string[] | null
          name?: string
          phone?: string | null
          piece_type?: string
          status?: string | null
        }
        Relationships: []
      }
      designs: {
        Row: {
          allowed_metals: Database["public"]["Enums"]["metal_type"][] | null
          base_cost_estimate: number | null
          base_price: number
          category: Database["public"]["Enums"]["design_category"]
          commission_type: Database["public"]["Enums"]["commission_type"]
          commission_value: number
          created_at: string
          creator_profile_id: string
          description: string | null
          gallery_image_urls: string[] | null
          id: string
          is_featured: boolean
          main_image_url: string
          slug: string
          status: Database["public"]["Enums"]["design_status"]
          stone_options: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          allowed_metals?: Database["public"]["Enums"]["metal_type"][] | null
          base_cost_estimate?: number | null
          base_price: number
          category: Database["public"]["Enums"]["design_category"]
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          creator_profile_id: string
          description?: string | null
          gallery_image_urls?: string[] | null
          id?: string
          is_featured?: boolean
          main_image_url: string
          slug: string
          status?: Database["public"]["Enums"]["design_status"]
          stone_options?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          allowed_metals?: Database["public"]["Enums"]["metal_type"][] | null
          base_cost_estimate?: number | null
          base_price?: number
          category?: Database["public"]["Enums"]["design_category"]
          commission_type?: Database["public"]["Enums"]["commission_type"]
          commission_value?: number
          created_at?: string
          creator_profile_id?: string
          description?: string | null
          gallery_image_urls?: string[] | null
          id?: string
          is_featured?: boolean
          main_image_url?: string
          slug?: string
          status?: Database["public"]["Enums"]["design_status"]
          stone_options?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "designs_creator_profile_id_fkey"
            columns: ["creator_profile_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_quotes: {
        Row: {
          created_at: string
          description: string
          email: string
          id: string
          image_urls: string[] | null
          name: string
          phone: string | null
          preferred_contact: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          id?: string
          image_urls?: string[] | null
          name: string
          phone?: string | null
          preferred_contact?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          id?: string
          image_urls?: string[] | null
          name?: string
          phone?: string | null
          preferred_contact?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "creator" | "admin"
      application_status: "new" | "under_review" | "approved" | "rejected"
      commission_type: "percentage" | "fixed"
      creator_status: "pending" | "active" | "suspended"
      design_category:
        | "ring"
        | "pendant"
        | "chain"
        | "bracelet"
        | "earrings"
        | "other"
      design_status:
        | "draft"
        | "pending_approval"
        | "published"
        | "archived"
        | "rejected"
      earning_status: "pending" | "ready_to_pay" | "paid" | "void"
      metal_type:
        | "14k_yellow"
        | "14k_white"
        | "14k_rose"
        | "18k"
        | "platinum"
        | "silver"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "creator", "admin"],
      application_status: ["new", "under_review", "approved", "rejected"],
      commission_type: ["percentage", "fixed"],
      creator_status: ["pending", "active", "suspended"],
      design_category: [
        "ring",
        "pendant",
        "chain",
        "bracelet",
        "earrings",
        "other",
      ],
      design_status: [
        "draft",
        "pending_approval",
        "published",
        "archived",
        "rejected",
      ],
      earning_status: ["pending", "ready_to_pay", "paid", "void"],
      metal_type: [
        "14k_yellow",
        "14k_white",
        "14k_rose",
        "18k",
        "platinum",
        "silver",
      ],
    },
  },
} as const
