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
      body_metrics: {
        Row: {
          arm_circumference: number | null
          bmi: number
          created_at: string
          hip_circumference: number | null
          id: string
          measurement_date: string
          side_circumference: number | null
          thigh_circumference: number | null
          user_id: string
          waist_circumference: number | null
          weight: number
        }
        Insert: {
          arm_circumference?: number | null
          bmi: number
          created_at?: string
          hip_circumference?: number | null
          id?: string
          measurement_date: string
          side_circumference?: number | null
          thigh_circumference?: number | null
          user_id: string
          waist_circumference?: number | null
          weight: number
        }
        Update: {
          arm_circumference?: number | null
          bmi?: number
          created_at?: string
          hip_circumference?: number | null
          id?: string
          measurement_date?: string
          side_circumference?: number | null
          thigh_circumference?: number | null
          user_id?: string
          waist_circumference?: number | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "body_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      food_categories: {
        Row: {
          id: string
          title: string
          value: string
        }
        Insert: {
          id?: string
          title: string
          value: string
        }
        Update: {
          id?: string
          title?: string
          value?: string
        }
        Relationships: []
      }
      food_units: {
        Row: {
          calories_per_standard_amount: number
          category_id: string
          created_at: string
          created_by: string
          id: string
          name: string
          standard_amount_description: string
        }
        Insert: {
          calories_per_standard_amount: number
          category_id: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          standard_amount_description: string
        }
        Update: {
          calories_per_standard_amount?: number
          category_id?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          standard_amount_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_units_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_units_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_logs: {
        Row: {
          calories_consumed: number
          created_at: string
          id: string
          log_date: string
          meal_option_id: string
          meal_type: string
          user_id: string
        }
        Insert: {
          calories_consumed: number
          created_at?: string
          id?: string
          log_date: string
          meal_option_id: string
          meal_type: string
          user_id: string
        }
        Update: {
          calories_consumed?: number
          created_at?: string
          id?: string
          log_date?: string
          meal_option_id?: string
          meal_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_meal_option_id_fkey"
            columns: ["meal_option_id"]
            isOneToOne: false
            referencedRelation: "meal_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_option_items: {
        Row: {
          created_at: string
          food_unit_id: string
          id: string
          meal_option_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          food_unit_id: string
          id?: string
          meal_option_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          food_unit_id?: string
          id?: string
          meal_option_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_option_items_food_unit_id_fkey"
            columns: ["food_unit_id"]
            isOneToOne: false
            referencedRelation: "food_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_option_items_meal_option_id_fkey"
            columns: ["meal_option_id"]
            isOneToOne: false
            referencedRelation: "meal_options"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_options: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          meal_type: string
          name: string
          total_calories: number
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          meal_type: string
          name: string
          total_calories: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          meal_type?: string
          name?: string
          total_calories?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_options_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          id: string
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          id: number
          is_valid: boolean
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_valid: boolean
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_valid?: boolean
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string | null
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password?: string | null
          role?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string | null
          role?: string
          username?: string
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          user_id: string
          workout_date: string
          workout_type: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          user_id: string
          workout_date: string
          workout_type: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          user_id?: string
          workout_date?: string
          workout_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      user_role: "user" | "admin"
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
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
