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
          design_link: string | null
          email: string
          id: string
          image_urls: string[] | null
          intent_type: string | null
          location: string | null
          message: string
          name: string
          phone: string | null
          preferred_contact: string | null
          related_design_id: string | null
          related_repair_id: string | null
          timeline_urgency: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          design_link?: string | null
          email: string
          id?: string
          image_urls?: string[] | null
          intent_type?: string | null
          location?: string | null
          message: string
          name: string
          phone?: string | null
          preferred_contact?: string | null
          related_design_id?: string | null
          related_repair_id?: string | null
          timeline_urgency?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          design_link?: string | null
          email?: string
          id?: string
          image_urls?: string[] | null
          intent_type?: string | null
          location?: string | null
          message?: string
          name?: string
          phone?: string | null
          preferred_contact?: string | null
          related_design_id?: string | null
          related_repair_id?: string | null
          timeline_urgency?: string | null
          user_id?: string | null
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
          admin_internal_notes: string | null
          admin_quote_amount: number | null
          admin_quote_message: string | null
          assigned_to: string | null
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
          status_updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_internal_notes?: string | null
          admin_quote_amount?: number | null
          admin_quote_message?: string | null
          assigned_to?: string | null
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
          status_updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_internal_notes?: string | null
          admin_quote_amount?: number | null
          admin_quote_message?: string | null
          assigned_to?: string | null
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
          status_updated_at?: string | null
          user_id?: string | null
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
      email_logs: {
        Row: {
          error_message: string | null
          id: string
          metadata: Json | null
          related_design_id: string | null
          related_inquiry_id: string | null
          sent_at: string
          status: string
          subject: string | null
          template: string
          to_email: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          metadata?: Json | null
          related_design_id?: string | null
          related_inquiry_id?: string | null
          sent_at?: string
          status?: string
          subject?: string | null
          template: string
          to_email: string
        }
        Update: {
          error_message?: string | null
          id?: string
          metadata?: Json | null
          related_design_id?: string | null
          related_inquiry_id?: string | null
          sent_at?: string
          status?: string
          subject?: string | null
          template?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_related_design_id_fkey"
            columns: ["related_design_id"]
            isOneToOne: false
            referencedRelation: "user_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_related_inquiry_id_fkey"
            columns: ["related_inquiry_id"]
            isOneToOne: false
            referencedRelation: "custom_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_quotes: {
        Row: {
          admin_image_urls: string[] | null
          approved: boolean | null
          approved_at: string | null
          city: string | null
          created_at: string
          description: string
          email: string
          fulfillment_method: string | null
          id: string
          image_urls: string[] | null
          internal_notes: string | null
          item_type: string | null
          logistics_notes: string | null
          name: string
          payment_link_url: string | null
          payment_status: string | null
          phone: string | null
          pickup_window: string | null
          preferred_contact: string | null
          preferred_dropoff_time: string | null
          quoted_price: number | null
          repair_type: string | null
          shopify_order_id: string | null
          shopify_reference: string | null
          state: string | null
          status: string | null
          street_address: string | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          admin_image_urls?: string[] | null
          approved?: boolean | null
          approved_at?: string | null
          city?: string | null
          created_at?: string
          description: string
          email: string
          fulfillment_method?: string | null
          id?: string
          image_urls?: string[] | null
          internal_notes?: string | null
          item_type?: string | null
          logistics_notes?: string | null
          name: string
          payment_link_url?: string | null
          payment_status?: string | null
          phone?: string | null
          pickup_window?: string | null
          preferred_contact?: string | null
          preferred_dropoff_time?: string | null
          quoted_price?: number | null
          repair_type?: string | null
          shopify_order_id?: string | null
          shopify_reference?: string | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          admin_image_urls?: string[] | null
          approved?: boolean | null
          approved_at?: string | null
          city?: string | null
          created_at?: string
          description?: string
          email?: string
          fulfillment_method?: string | null
          id?: string
          image_urls?: string[] | null
          internal_notes?: string | null
          item_type?: string | null
          logistics_notes?: string | null
          name?: string
          payment_link_url?: string | null
          payment_status?: string | null
          phone?: string | null
          pickup_window?: string | null
          preferred_contact?: string | null
          preferred_dropoff_time?: string | null
          quoted_price?: number | null
          repair_type?: string | null
          shopify_order_id?: string | null
          shopify_reference?: string | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      user_designs: {
        Row: {
          cad_submitted_at: string | null
          created_at: string
          custom_inquiry_id: string | null
          flow_type: string
          form_inputs: Json
          hero_image_url: string | null
          id: string
          inspiration_image_urls: string[] | null
          name: string
          overview: string | null
          revision_contact_preference: string | null
          revision_notes: string | null
          revision_requested_at: string | null
          side_image_url: string | null
          spec_sheet: Json | null
          status: string
          top_image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cad_submitted_at?: string | null
          created_at?: string
          custom_inquiry_id?: string | null
          flow_type?: string
          form_inputs?: Json
          hero_image_url?: string | null
          id?: string
          inspiration_image_urls?: string[] | null
          name: string
          overview?: string | null
          revision_contact_preference?: string | null
          revision_notes?: string | null
          revision_requested_at?: string | null
          side_image_url?: string | null
          spec_sheet?: Json | null
          status?: string
          top_image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cad_submitted_at?: string | null
          created_at?: string
          custom_inquiry_id?: string | null
          flow_type?: string
          form_inputs?: Json
          hero_image_url?: string | null
          id?: string
          inspiration_image_urls?: string[] | null
          name?: string
          overview?: string | null
          revision_contact_preference?: string | null
          revision_notes?: string | null
          revision_requested_at?: string | null
          side_image_url?: string | null
          spec_sheet?: Json | null
          status?: string
          top_image_url?: string | null
          updated_at?: string
          user_id?: string
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
      link_guest_repairs: {
        Args: { _email: string; _user_id: string }
        Returns: number
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
