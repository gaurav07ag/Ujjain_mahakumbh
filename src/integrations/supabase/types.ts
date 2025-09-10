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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alert_locations: {
        Row: {
          affected_radius: number | null
          alert_id: string | null
          created_at: string | null
          id: string
          risk_level: Database["public"]["Enums"]["alert_severity"]
          x_coordinate: number
          y_coordinate: number
          zone_name: string
        }
        Insert: {
          affected_radius?: number | null
          alert_id?: string | null
          created_at?: string | null
          id?: string
          risk_level: Database["public"]["Enums"]["alert_severity"]
          x_coordinate: number
          y_coordinate: number
          zone_name: string
        }
        Update: {
          affected_radius?: number | null
          alert_id?: string | null
          created_at?: string | null
          id?: string
          risk_level?: Database["public"]["Enums"]["alert_severity"]
          x_coordinate?: number
          y_coordinate?: number
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_locations_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          acknowledged_at: string | null
          camera_id: string | null
          coordinates: unknown | null
          created_at: string | null
          crowd_count: number | null
          density_percentage: number | null
          description: string
          id: string
          location_name: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          camera_id?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          crowd_count?: number | null
          density_percentage?: number | null
          description: string
          id?: string
          location_name: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          camera_id?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          crowd_count?: number | null
          density_percentage?: number | null
          description?: string
          id?: string
          location_name?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          department: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string
          position: string
          priority_level: number
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          position: string
          priority_level?: number
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          position?: string
          priority_level?: number
        }
        Relationships: []
      }
      emergency_responses: {
        Row: {
          acknowledged_at: string | null
          alert_id: string | null
          contact_id: string | null
          id: string
          message: string
          resolved_at: string | null
          response_type: string
          sent_at: string | null
          status: Database["public"]["Enums"]["emergency_status"] | null
        }
        Insert: {
          acknowledged_at?: string | null
          alert_id?: string | null
          contact_id?: string | null
          id?: string
          message: string
          resolved_at?: string | null
          response_type: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["emergency_status"] | null
        }
        Update: {
          acknowledged_at?: string | null
          alert_id?: string | null
          contact_id?: string | null
          id?: string
          message?: string
          resolved_at?: string | null
          response_type?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["emergency_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_responses_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_responses_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "emergency_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "low" | "moderate" | "high" | "critical"
      alert_status: "active" | "acknowledged" | "resolved" | "dismissed"
      emergency_status: "pending" | "dispatched" | "resolved"
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
      alert_severity: ["low", "moderate", "high", "critical"],
      alert_status: ["active", "acknowledged", "resolved", "dismissed"],
      emergency_status: ["pending", "dispatched", "resolved"],
    },
  },
} as const
