// Database types for Supabase
// Generated from schema - update after running migrations

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          created_at: string
          age_years: number
          current_location_id: string | null
          cash_kobo: number
          bank_kobo: number
          housing_unit_id: string | null
          rent_due_date: string | null
          last_tick_at: string
          is_incarcerated: boolean
          prison_release_at: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      player_needs: {
        Row: {
          player_id: string
          hunger: number
          energy: number
          hygiene: number
          fun: number
          social: number
          bladder: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['player_needs']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['player_needs']['Row']>
      }
      transaction_ledger: {
        Row: {
          id: number
          player_id: string
          type: string
          amount_kobo: number
          balance_after_kobo: number
          account_type: 'cash' | 'bank'
          reference_id: string | null
          description: string
          idempotency_key: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transaction_ledger']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: {
      execute_transaction: {
        Args: {
          p_player_id: string
          p_type: string
          p_amount_kobo: number
          p_account_type: string
          p_description: string
          p_reference_id: string | null
          p_idempotency_key: string
        }
        Returns: {
          success: boolean
          new_balance_kobo: number
          error_message: string | null
        }[]
      }
    }
    Enums: Record<string, never>
  }
}