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
      assets: {
        Row: {
          created_at: string
          duration_seconds: number | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          metadata: Json | null
          mime_type: string | null
          project_id: string
          storage_path: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          project_id: string
          storage_path?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          project_id?: string
          storage_path?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_posts: {
        Row: {
          caption: string | null
          content_item_id: string | null
          created_at: string
          id: string
          platform: string | null
          project_id: string
          scheduled_for: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          content_item_id?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          project_id: string
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          content_item_id?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          project_id?: string
          scheduled_for?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_posts_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          aspect_ratio: string | null
          created_at: string
          duration_seconds: number | null
          external_job_id: string | null
          final_url: string | null
          id: string
          metadata: Json | null
          preview_url: string | null
          project_id: string
          source_asset_id: string | null
          status: string
          style_id: string | null
          title: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aspect_ratio?: string | null
          created_at?: string
          duration_seconds?: number | null
          external_job_id?: string | null
          final_url?: string | null
          id?: string
          metadata?: Json | null
          preview_url?: string | null
          project_id: string
          source_asset_id?: string | null
          status?: string
          style_id?: string | null
          title?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aspect_ratio?: string | null
          created_at?: string
          duration_seconds?: number | null
          external_job_id?: string | null
          final_url?: string | null
          id?: string
          metadata?: Json | null
          preview_url?: string | null
          project_id?: string
          source_asset_id?: string | null
          status?: string
          style_id?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_source_asset_id_fkey"
            columns: ["source_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      lyrics: {
        Row: {
          created_at: string
          end_seconds: number | null
          id: string
          line_index: number
          project_id: string
          section: string | null
          start_seconds: number | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_seconds?: number | null
          id?: string
          line_index: number
          project_id: string
          section?: string | null
          start_seconds?: number | null
          text?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_seconds?: number | null
          id?: string
          line_index?: number
          project_id?: string
          section?: string | null
          start_seconds?: number | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lyrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          artist: string | null
          bpm: number | null
          cover_url: string | null
          created_at: string
          id: string
          release_info: string | null
          song_key: string | null
          status: string
          style_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist?: string | null
          bpm?: number | null
          cover_url?: string | null
          created_at?: string
          id?: string
          release_info?: string | null
          song_key?: string | null
          status?: string
          style_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist?: string | null
          bpm?: number | null
          cover_url?: string | null
          created_at?: string
          id?: string
          release_info?: string | null
          song_key?: string | null
          status?: string
          style_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      styles: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          gradient: string | null
          id: string
          name: string
          preview_url: string | null
          slug: string
          sort_order: number | null
          tag: string | null
          tokens: string[] | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          gradient?: string | null
          id?: string
          name: string
          preview_url?: string | null
          slug: string
          sort_order?: number | null
          tag?: string | null
          tokens?: string[] | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          gradient?: string | null
          id?: string
          name?: string
          preview_url?: string | null
          slug?: string
          sort_order?: number | null
          tag?: string | null
          tokens?: string[] | null
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
    Enums: {},
  },
} as const
