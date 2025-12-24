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
            garments: {
                Row: {
                    id: string
                    name: string
                    serial_number: string
                    brand: string
                    model: string
                    category: string
                    size: string
                    color: string
                    price: number
                    current_stock: number
                    date_added: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    serial_number: string
                    brand: string
                    model: string
                    category: string
                    size: string
                    color: string
                    price: number
                    current_stock?: number
                    date_added?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    serial_number?: string
                    brand?: string
                    model?: string
                    category?: string
                    size?: string
                    color?: string
                    price?: number
                    current_stock?: number
                    date_added?: string
                    created_at?: string
                    updated_at?: string
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
