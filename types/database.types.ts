export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          timezone: string | null
          notification_pref: 'email' | 'push' | 'none'
          paused_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          timezone?: string | null
          notification_pref?: 'email' | 'push' | 'none'
          paused_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          timezone?: string | null
          notification_pref?: 'email' | 'push' | 'none'
          paused_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          user_id: string
          mood: number
          energy: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: number
          energy: number
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: number
          energy?: number
          note?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      user_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
        }
      }
    }
    Functions: {
      [_: string]: never
    }
    Enums: {
      [_: string]: never
    }
  }
}
