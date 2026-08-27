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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      guest_parties: {
        Row: {
          allocated_seats: number
          created_at: string | null
          id: string
          invitation_id: string
          is_edited: boolean | null
          party_name: string
          rsvp_slug: string
        }
        Insert: {
          allocated_seats?: number
          created_at?: string | null
          id?: string
          invitation_id: string
          is_edited?: boolean | null
          party_name: string
          rsvp_slug?: string
        }
        Update: {
          allocated_seats?: number
          created_at?: string | null
          id?: string
          invitation_id?: string
          is_edited?: boolean | null
          party_name?: string
          rsvp_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_parties_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          data: Json | null
          dress_code: Json | null
          event_date: string | null
          font: string | null
          gallery_images: Json | null
          hero_image_url: string | null
          hero_names: string | null
          hero_title: string | null
          id: string
          is_published: boolean
          music_url: string | null
          photos: Json | null
          primary_color: string | null
          slug: string | null
          template: string | null
          timeline_items: Json | null
          title: string | null
          user_id: string | null
          claim_code: string | null
          is_custom_design: boolean
          is_expired: boolean
          expires_at: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          dress_code?: Json | null
          event_date?: string | null
          font?: string | null
          gallery_images?: Json | null
          hero_image_url?: string | null
          hero_names?: string | null
          hero_title?: string | null
          id?: string
          is_published?: boolean
          music_url?: string | null
          photos?: Json | null
          primary_color?: string | null
          slug?: string | null
          template?: string | null
          timeline_items?: Json | null
          title?: string | null
          user_id?: string | null
          claim_code?: string | null
          is_custom_design?: boolean
          is_expired?: boolean
          expires_at?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          dress_code?: Json | null
          event_date?: string | null
          font?: string | null
          gallery_images?: Json | null
          hero_image_url?: string | null
          hero_names?: string | null
          hero_title?: string | null
          id?: string
          is_published?: boolean
          music_url?: string | null
          photos?: Json | null
          primary_color?: string | null
          slug?: string | null
          template?: string | null
          timeline_items?: Json | null
          title?: string | null
          user_id?: string | null
          claim_code?: string | null
          is_custom_design?: boolean
          is_expired?: boolean
          expires_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          plan: string | null
          stripe_customer_id: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          plan?: string | null
          stripe_customer_id?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          plan?: string | null
          stripe_customer_id?: string | null
          is_admin?: boolean
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attending_count: number
          guest_names: string[] | null
          guest_party_id: string
          id: string
          notes: string | null
          submitted_at: string | null
        }
        Insert: {
          attending_count?: number
          guest_names?: string[] | null
          guest_party_id: string
          id?: string
          notes?: string | null
          submitted_at?: string | null
        }
        Update: {
          attending_count?: number
          guest_names?: string[] | null
          guest_party_id?: string
          id?: string
          notes?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_party_id_fkey"
            columns: ["guest_party_id"]
            isOneToOne: true
            referencedRelation: "guest_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps_legacy: {
        Row: {
          created_at: string
          id: number
          invitation_id: string | null
          message: string | null
          name: string
          plus_ones: number
          status: Database["public"]["Enums"]["rsvp_status"]
        }
        Insert: {
          created_at?: string
          id?: number
          invitation_id?: string | null
          message?: string | null
          name: string
          plus_ones?: number
          status?: Database["public"]["Enums"]["rsvp_status"]
        }
        Update: {
          created_at?: string
          id?: number
          invitation_id?: string | null
          message?: string | null
          name?: string
          plus_ones?: number
          status?: Database["public"]["Enums"]["rsvp_status"]
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      template_defaults: {
        Row: {
          gallery_images: Json | null
          hero_image_url: string | null
          id: string
          template_name: string
        }
        Insert: {
          gallery_images?: Json | null
          hero_image_url?: string | null
          id?: string
          template_name: string
        }
        Update: {
          gallery_images?: Json | null
          hero_image_url?: string | null
          id?: string
          template_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_rsvp_slug: { Args: never; Returns: string }
    }
    Enums: {
      rsvp_status: "ATTENDING" | "DECLINED" | "PENDING"
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
      rsvp_status: ["ATTENDING", "DECLINED", "PENDING"],
    },
  },
} as const
