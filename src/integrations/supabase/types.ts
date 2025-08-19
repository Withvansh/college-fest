export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_activity: {
        Row: {
          action: string
          actor_name: string | null
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string | null
          type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_name?: string | null
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
          type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_name?: string | null
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
          type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          created_at: string
          created_by: string | null
          icon: string | null
          id: string
          image_url: string | null
          message: string
          priority: string
          scheduled_for: string | null
          sent_at: string | null
          target_type: string
          target_value: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          message: string
          priority?: string
          scheduled_for?: string | null
          sent_at?: string | null
          target_type: string
          target_value?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          message?: string
          priority?: string
          scheduled_for?: string | null
          sent_at?: string | null
          target_type?: string
          target_value?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      ai_interviews: {
        Row: {
          behavioral_score: number | null
          cheating_alerts: Json | null
          communication_score: number | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          feedback: Json | null
          id: string
          industry: string | null
          interview_type: string | null
          job_description: string | null
          job_title: string | null
          overall_score: number | null
          questions: Json
          responses: Json
          started_at: string | null
          status: Database["public"]["Enums"]["interview_status"] | null
          technical_score: number | null
          user_id: string | null
        }
        Insert: {
          behavioral_score?: number | null
          cheating_alerts?: Json | null
          communication_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          feedback?: Json | null
          id?: string
          industry?: string | null
          interview_type?: string | null
          job_description?: string | null
          job_title?: string | null
          overall_score?: number | null
          questions?: Json
          responses?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["interview_status"] | null
          technical_score?: number | null
          user_id?: string | null
        }
        Update: {
          behavioral_score?: number | null
          cheating_alerts?: Json | null
          communication_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          feedback?: Json | null
          id?: string
          industry?: string | null
          interview_type?: string | null
          job_description?: string | null
          job_title?: string | null
          overall_score?: number | null
          questions?: Json
          responses?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["interview_status"] | null
          technical_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          company_id: string | null
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          approved_by: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          date: string
          employee_id: string | null
          id: string
          location: Json | null
          notes: string | null
          overtime_hours: number | null
          status: Database["public"]["Enums"]["attendance_status"] | null
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date: string
          employee_id?: string | null
          id?: string
          location?: Json | null
          notes?: string | null
          overtime_hours?: number | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          location?: Json | null
          notes?: string | null
          overtime_hours?: number | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          slug: string | null
          status: string
          tags: Json[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          tags?: Json[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          tags?: Json[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      campus_drives: {
        Row: {
          college_id: string | null
          created_at: string | null
          description: string | null
          drive_date: string
          eligibility_criteria: Json | null
          id: string
          is_active: boolean | null
          location: string | null
          positions_available: number
          recruiter_id: string | null
          registration_deadline: string
          salary_package: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          college_id?: string | null
          created_at?: string | null
          description?: string | null
          drive_date: string
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          positions_available: number
          recruiter_id?: string | null
          registration_deadline: string
          salary_package?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          college_id?: string | null
          created_at?: string | null
          description?: string | null
          drive_date?: string
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          positions_available?: number
          recruiter_id?: string | null
          registration_deadline?: string
          salary_package?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campus_drives_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campus_drives_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          city: string | null
          created_at: string
          established_year: number | null
          id: string
          is_active: boolean
          name: string
          region: string | null
          state: string | null
          student_count: number | null
          type: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          established_year?: number | null
          id?: string
          is_active?: boolean
          name: string
          region?: string | null
          state?: string | null
          student_count?: number | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          established_year?: number | null
          id?: string
          is_active?: boolean
          name?: string
          region?: string | null
          state?: string | null
          student_count?: number | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          communication_type: Database["public"]["Enums"]["communication_type"]
          created_at: string
          delivered_at: string | null
          id: string
          message: string
          metadata: Json | null
          read_at: string | null
          recipient_id: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          scheduled_at: string | null
          sender_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          communication_type: Database["public"]["Enums"]["communication_type"]
          created_at?: string
          delivered_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read_at?: string | null
          recipient_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          scheduled_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          communication_type?: Database["public"]["Enums"]["communication_type"]
          created_at?: string
          delivered_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read_at?: string | null
          recipient_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          scheduled_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_code: string | null
          company_size: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          settings: Json | null
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_code?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          settings?: Json | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_code?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          settings?: Json | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      dashboards: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          onboarding_completed: boolean | null
          preferences: Json | null
          role: string
          updated_at: string | null
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          role: string
          updated_at?: string | null
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      digital_orders: {
        Row: {
          amount_paid: number
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          download_link: string | null
          id: string
          order_status: string | null
          payment_status: string | null
          product_id: string | null
          purchase_date: string | null
        }
        Insert: {
          amount_paid: number
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          download_link?: string | null
          id?: string
          order_status?: string | null
          payment_status?: string | null
          product_id?: string | null
          purchase_date?: string | null
        }
        Update: {
          amount_paid?: number
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          download_link?: string | null
          id?: string
          order_status?: string | null
          payment_status?: string | null
          product_id?: string | null
          purchase_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "digital_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "digital_products"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_products: {
        Row: {
          benefits: string[] | null
          category: string
          created_at: string | null
          created_by: string | null
          file_type: string | null
          id: string
          is_active: boolean | null
          price: number
          product_file_url: string | null
          short_description: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          category: string
          created_at?: string | null
          created_by?: string | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          price: number
          product_file_url?: string | null
          short_description?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          price?: number
          product_file_url?: string | null
          short_description?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id: string | null
          expiry_date: string | null
          file_size: number | null
          file_url: string
          id: string
          is_mandatory: boolean | null
          is_verified: boolean | null
          mime_type: string | null
          updated_at: string
          uploaded_by: string | null
          verified_at: string | null
          verified_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id?: string | null
          expiry_date?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_mandatory?: boolean | null
          is_verified?: boolean | null
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          employee_id?: string | null
          expiry_date?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_mandatory?: boolean | null
          is_verified?: boolean | null
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          bank_details: Json | null
          company_id: string | null
          confirmation_date: string | null
          created_at: string
          created_by: string | null
          department: string | null
          designation: string | null
          emergency_contact: Json | null
          employee_id: string
          employee_type: string | null
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          id: string
          joining_date: string | null
          notice_period: number | null
          probation_period: number | null
          reporting_manager_id: string | null
          salary_structure: Json | null
          updated_at: string
          user_id: string | null
          work_location: string | null
        }
        Insert: {
          bank_details?: Json | null
          company_id?: string | null
          confirmation_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          designation?: string | null
          emergency_contact?: Json | null
          employee_id: string
          employee_type?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          id?: string
          joining_date?: string | null
          notice_period?: number | null
          probation_period?: number | null
          reporting_manager_id?: string | null
          salary_structure?: Json | null
          updated_at?: string
          user_id?: string | null
          work_location?: string | null
        }
        Update: {
          bank_details?: Json | null
          company_id?: string | null
          confirmation_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          designation?: string | null
          emergency_contact?: Json | null
          employee_id?: string
          employee_type?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          id?: string
          joining_date?: string | null
          notice_period?: number | null
          probation_period?: number | null
          reporting_manager_id?: string | null
          salary_structure?: Json | null
          updated_at?: string
          user_id?: string | null
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_reporting_manager_id_fkey"
            columns: ["reporting_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employees_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      freelance_contracts: {
        Row: {
          actual_completion_date: string | null
          client_id: string | null
          contract_amount: number
          created_at: string
          currency: string | null
          escrow_amount: number | null
          expected_completion_date: string
          freelancer_id: string | null
          gig_id: string | null
          id: string
          milestones: Json | null
          payment_schedule: Json | null
          platform_fee_percentage: number | null
          proposal_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["project_status"] | null
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          client_id?: string | null
          contract_amount: number
          created_at?: string
          currency?: string | null
          escrow_amount?: number | null
          expected_completion_date: string
          freelancer_id?: string | null
          gig_id?: string | null
          id?: string
          milestones?: Json | null
          payment_schedule?: Json | null
          platform_fee_percentage?: number | null
          proposal_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["project_status"] | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          client_id?: string | null
          contract_amount?: number
          created_at?: string
          currency?: string | null
          escrow_amount?: number | null
          expected_completion_date?: string
          freelancer_id?: string | null
          gig_id?: string | null
          id?: string
          milestones?: Json | null
          payment_schedule?: Json | null
          platform_fee_percentage?: number | null
          proposal_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelance_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelance_contracts_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelance_contracts_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "freelance_gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelance_contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "freelance_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      freelance_gigs: {
        Row: {
          attachments: string[] | null
          budget_max: number | null
          budget_min: number | null
          category: string | null
          client_id: string | null
          created_at: string | null
          deadline: string | null
          description: string
          duration_days: number | null
          experience_level: string | null
          id: string
          is_active: boolean | null
          milestone_based: boolean | null
          milestones: Json | null
          project_type: string | null
          required_availability: string | null
          skills_required: string[] | null
          subcategory: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          duration_days?: number | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          milestone_based?: boolean | null
          milestones?: Json | null
          project_type?: string | null
          required_availability?: string | null
          skills_required?: string[] | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          duration_days?: number | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          milestone_based?: boolean | null
          milestones?: Json | null
          project_type?: string | null
          required_availability?: string | null
          skills_required?: string[] | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freelance_gigs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freelance_proposals: {
        Row: {
          delivery_days: number
          freelancer_id: string | null
          gig_id: string | null
          id: string
          portfolio_links: string[] | null
          proposal_text: string
          quoted_amount: number
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          delivery_days: number
          freelancer_id?: string | null
          gig_id?: string | null
          id?: string
          portfolio_links?: string[] | null
          proposal_text: string
          quoted_amount: number
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          delivery_days?: number
          freelancer_id?: string | null
          gig_id?: string | null
          id?: string
          portfolio_links?: string[] | null
          proposal_text?: string
          quoted_amount?: number
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freelance_proposals_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelance_proposals_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "freelance_gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          created_at: string | null
          current_value: number | null
          description: string | null
          due_date: string | null
          employee_id: string | null
          id: string
          priority: string | null
          status: string | null
          target_value: number
          title: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          target_value: number
          title: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          target_value?: number
          title?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hire_profiles: {
        Row: {
          age: number
          availability: Json | null
          bio: string | null
          created_at: string
          email: string
          experience_years: number
          gender: string
          id: string
          is_active: boolean | null
          job_category: string
          location: string
          name: string
          nid_url: string | null
          pan_url: string | null
          phone: string
          photo_url: string | null
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          availability?: Json | null
          bio?: string | null
          created_at?: string
          email: string
          experience_years?: number
          gender: string
          id?: string
          is_active?: boolean | null
          job_category: string
          location: string
          name: string
          nid_url?: string | null
          pan_url?: string | null
          phone: string
          photo_url?: string | null
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          availability?: Json | null
          bio?: string | null
          created_at?: string
          email?: string
          experience_years?: number
          gender?: string
          id?: string
          is_active?: boolean | null
          job_category?: string
          location?: string
          name?: string
          nid_url?: string | null
          pan_url?: string | null
          phone?: string
          photo_url?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hire_requests: {
        Row: {
          created_at: string
          date_requested: string
          hiree_profile_id: string
          hirer_email: string
          hirer_name: string
          hirer_phone: string
          hirer_user_id: string
          id: string
          message: string | null
          status: string | null
          time_slot: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_requested: string
          hiree_profile_id: string
          hirer_email: string
          hirer_name: string
          hirer_phone: string
          hirer_user_id: string
          id?: string
          message?: string | null
          status?: string | null
          time_slot: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_requested?: string
          hiree_profile_id?: string
          hirer_email?: string
          hirer_name?: string
          hirer_phone?: string
          hirer_user_id?: string
          id?: string
          message?: string | null
          status?: string | null
          time_slot?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hire_requests_hiree_profile_id_fkey"
            columns: ["hiree_profile_id"]
            isOneToOne: false
            referencedRelation: "hire_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          communication_score: number | null
          created_at: string
          cultural_fit_score: number | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          interview_notes: string | null
          interview_round: number | null
          interview_type: Database["public"]["Enums"]["interview_type"] | null
          interviewer_id: string | null
          job_application_id: string | null
          location: string | null
          meeting_link: string | null
          rating: number | null
          recommendation: string | null
          scheduled_at: string
          status: string | null
          technical_score: number | null
          updated_at: string
        }
        Insert: {
          communication_score?: number | null
          created_at?: string
          cultural_fit_score?: number | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_notes?: string | null
          interview_round?: number | null
          interview_type?: Database["public"]["Enums"]["interview_type"] | null
          interviewer_id?: string | null
          job_application_id?: string | null
          location?: string | null
          meeting_link?: string | null
          rating?: number | null
          recommendation?: string | null
          scheduled_at: string
          status?: string | null
          technical_score?: number | null
          updated_at?: string
        }
        Update: {
          communication_score?: number | null
          created_at?: string
          cultural_fit_score?: number | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_notes?: string | null
          interview_round?: number | null
          interview_type?: Database["public"]["Enums"]["interview_type"] | null
          interviewer_id?: string | null
          job_application_id?: string | null
          location?: string | null
          meeting_link?: string | null
          rating?: number | null
          recommendation?: string | null
          scheduled_at?: string
          status?: string | null
          technical_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          company_id: string | null
          created_at: string
          currency: string | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string | null
          invoice_pdf_url: string | null
          paid_at: string | null
          status: string | null
          stripe_invoice_id: string | null
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          company_id?: string | null
          created_at?: string
          currency?: string | null
          due_date: string
          id?: string
          invoice_date: string
          invoice_number?: string | null
          invoice_pdf_url?: string | null
          paid_at?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          company_id?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          invoice_pdf_url?: string | null
          paid_at?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_id: string | null
          applied_at: string | null
          cover_letter: string | null
          id: string
          interview_score: number | null
          job_id: string | null
          notes: string | null
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          test_score: number | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          interview_score?: number | null
          job_id?: string | null
          notes?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          test_score?: number | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          interview_score?: number | null
          job_id?: string | null
          notes?: string | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          test_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          budget_max: number | null
          budget_min: number | null
          certifications_required: string[] | null
          company_id: string | null
          company_name: string
          created_at: string | null
          currency: string | null
          department: string | null
          description: string
          education_requirements: string[] | null
          employment_type: string | null
          experience_level: string | null
          experience_required: number | null
          hiring_manager_id: string | null
          id: string
          is_remote_allowed: boolean | null
          job_category: string | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          max_salary: number | null
          min_salary: number | null
          recruiter_id: string | null
          remote_allowed: boolean | null
          requirements: string
          skills_required: string[] | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          travel_required: string | null
          updated_at: string | null
          urgency_level: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          budget_max?: number | null
          budget_min?: number | null
          certifications_required?: string[] | null
          company_id?: string | null
          company_name: string
          created_at?: string | null
          currency?: string | null
          department?: string | null
          description: string
          education_requirements?: string[] | null
          employment_type?: string | null
          experience_level?: string | null
          experience_required?: number | null
          hiring_manager_id?: string | null
          id?: string
          is_remote_allowed?: boolean | null
          job_category?: string | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          max_salary?: number | null
          min_salary?: number | null
          recruiter_id?: string | null
          remote_allowed?: boolean | null
          requirements: string
          skills_required?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          travel_required?: string | null
          updated_at?: string | null
          urgency_level?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          budget_max?: number | null
          budget_min?: number | null
          certifications_required?: string[] | null
          company_id?: string | null
          company_name?: string
          created_at?: string | null
          currency?: string | null
          department?: string | null
          description?: string
          education_requirements?: string[] | null
          employment_type?: string | null
          experience_level?: string | null
          experience_required?: number | null
          hiring_manager_id?: string | null
          id?: string
          is_remote_allowed?: boolean | null
          job_category?: string | null
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string
          max_salary?: number | null
          min_salary?: number | null
          recruiter_id?: string | null
          remote_allowed?: boolean | null
          requirements?: string
          skills_required?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          travel_required?: string | null
          updated_at?: string | null
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_hiring_manager_id_fkey"
            columns: ["hiring_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_applications: {
        Row: {
          applied_date: string | null
          approved_by: string | null
          approved_date: string | null
          approver_comments: string | null
          created_at: string
          emergency_leave: boolean | null
          employee_id: string | null
          end_date: string
          id: string
          is_half_day: boolean | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          supporting_documents: string[] | null
          total_days: number
          updated_at: string
        }
        Insert: {
          applied_date?: string | null
          approved_by?: string | null
          approved_date?: string | null
          approver_comments?: string | null
          created_at?: string
          emergency_leave?: boolean | null
          employee_id?: string | null
          end_date: string
          id?: string
          is_half_day?: boolean | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          supporting_documents?: string[] | null
          total_days: number
          updated_at?: string
        }
        Update: {
          applied_date?: string | null
          approved_by?: string | null
          approved_date?: string | null
          approver_comments?: string | null
          created_at?: string
          emergency_leave?: boolean | null
          employee_id?: string | null
          end_date?: string
          id?: string
          is_half_day?: boolean | null
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          supporting_documents?: string[] | null
          total_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          available_leaves: number | null
          carry_forward_from_previous: number | null
          created_at: string
          employee_id: string | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          pending_leaves: number | null
          total_allocated: number | null
          updated_at: string
          used_leaves: number | null
          year: number
        }
        Insert: {
          available_leaves?: number | null
          carry_forward_from_previous?: number | null
          created_at?: string
          employee_id?: string | null
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          pending_leaves?: number | null
          total_allocated?: number | null
          updated_at?: string
          used_leaves?: number | null
          year: number
        }
        Update: {
          available_leaves?: number | null
          carry_forward_from_previous?: number | null
          created_at?: string
          employee_id?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          pending_leaves?: number | null
          total_allocated?: number | null
          updated_at?: string
          used_leaves?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_policies: {
        Row: {
          annual_quota: number | null
          carry_forward_limit: number | null
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          max_consecutive_days: number | null
          min_notice_days: number | null
          requires_approval: boolean | null
        }
        Insert: {
          annual_quota?: number | null
          carry_forward_limit?: number | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          max_consecutive_days?: number | null
          min_notice_days?: number | null
          requires_approval?: boolean | null
        }
        Update: {
          annual_quota?: number | null
          carry_forward_limit?: number | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          leave_type?: Database["public"]["Enums"]["leave_type"]
          max_consecutive_days?: number | null
          min_notice_days?: number | null
          requires_approval?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          notification_id: string | null
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          notification_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          notification_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "admin_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          first_application: boolean | null
          id: string
          profile_completed: boolean | null
          resume_uploaded: boolean | null
          skills_added: boolean | null
          test_taken: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          first_application?: boolean | null
          id?: string
          profile_completed?: boolean | null
          resume_uploaded?: boolean | null
          skills_added?: boolean | null
          test_taken?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          first_application?: boolean | null
          id?: string
          profile_completed?: boolean | null
          resume_uploaded?: boolean | null
          skills_added?: boolean | null
          test_taken?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_cycles: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          cycle_name: string
          id: string
          pay_date: string
          pay_period_end: string
          pay_period_start: string
          processed_at: string | null
          status: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          cycle_name: string
          id?: string
          pay_date: string
          pay_period_end: string
          pay_period_start: string
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          cycle_name?: string
          id?: string
          pay_date?: string
          pay_period_end?: string
          pay_period_start?: string
          processed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_cycles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          allowances: Json | null
          basic_salary: number
          bonus_amount: number | null
          created_at: string
          deductions: Json | null
          employee_id: string | null
          gross_salary: number
          id: string
          leave_days: number | null
          net_salary: number
          overtime_amount: number | null
          payroll_cycle_id: string | null
          payslip_pdf_url: string | null
          present_days: number | null
          status: string | null
          total_deductions: number
          updated_at: string
          working_days: number | null
        }
        Insert: {
          allowances?: Json | null
          basic_salary: number
          bonus_amount?: number | null
          created_at?: string
          deductions?: Json | null
          employee_id?: string | null
          gross_salary: number
          id?: string
          leave_days?: number | null
          net_salary: number
          overtime_amount?: number | null
          payroll_cycle_id?: string | null
          payslip_pdf_url?: string | null
          present_days?: number | null
          status?: string | null
          total_deductions: number
          updated_at?: string
          working_days?: number | null
        }
        Update: {
          allowances?: Json | null
          basic_salary?: number
          bonus_amount?: number | null
          created_at?: string
          deductions?: Json | null
          employee_id?: string | null
          gross_salary?: number
          id?: string
          leave_days?: number | null
          net_salary?: number
          overtime_amount?: number | null
          payroll_cycle_id?: string | null
          payslip_pdf_url?: string | null
          present_days?: number | null
          status?: string | null
          total_deductions?: number
          updated_at?: string
          working_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_payroll_cycle_id_fkey"
            columns: ["payroll_cycle_id"]
            isOneToOne: false
            referencedRelation: "payroll_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_cycles: {
        Row: {
          company_id: string | null
          created_at: string
          cycle_name: string
          cycle_type: string | null
          end_date: string
          final_review_deadline: string | null
          id: string
          manager_review_deadline: string | null
          self_review_deadline: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          cycle_name: string
          cycle_type?: string | null
          end_date: string
          final_review_deadline?: string | null
          id?: string
          manager_review_deadline?: string | null
          self_review_deadline?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          cycle_name?: string
          cycle_type?: string | null
          end_date?: string
          final_review_deadline?: string | null
          id?: string
          manager_review_deadline?: string | null
          self_review_deadline?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          areas_of_improvement: string | null
          comments: string | null
          created_at: string
          cycle_id: string | null
          development_plan: string | null
          employee_id: string | null
          goals_achievements: string | null
          id: string
          individual_ratings: Json | null
          overall_rating: number | null
          review_type: string
          reviewer_id: string | null
          status: string | null
          strengths: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          areas_of_improvement?: string | null
          comments?: string | null
          created_at?: string
          cycle_id?: string | null
          development_plan?: string | null
          employee_id?: string | null
          goals_achievements?: string | null
          id?: string
          individual_ratings?: Json | null
          overall_rating?: number | null
          review_type: string
          reviewer_id?: string | null
          status?: string | null
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          areas_of_improvement?: string | null
          comments?: string | null
          created_at?: string
          cycle_id?: string | null
          development_plan?: string | null
          employee_id?: string | null
          goals_achievements?: string | null
          id?: string
          individual_ratings?: Json | null
          overall_rating?: number | null
          review_type?: string
          reviewer_id?: string | null
          status?: string | null
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "performance_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          budget_range: string | null
          college_name: string | null
          company_name: string | null
          company_size: string | null
          contact_info: string | null
          created_at: string | null
          degree: string | null
          education: string | null
          email: string
          experience_years: number | null
          final_year_students: number | null
          full_name: string
          github_url: string | null
          hiring_needs: string | null
          id: string
          institution_name: string | null
          is_deleted: boolean
          is_verified: boolean | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          placement_officer_contact: string | null
          portfolio_url: string | null
          profile_complete: boolean | null
          project_description: string | null
          resume_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          student_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          budget_range?: string | null
          college_name?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_info?: string | null
          created_at?: string | null
          degree?: string | null
          education?: string | null
          email: string
          experience_years?: number | null
          final_year_students?: number | null
          full_name: string
          github_url?: string | null
          hiring_needs?: string | null
          id: string
          institution_name?: string | null
          is_deleted?: boolean
          is_verified?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          placement_officer_contact?: string | null
          portfolio_url?: string | null
          profile_complete?: boolean | null
          project_description?: string | null
          resume_url?: string | null
          role: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          budget_range?: string | null
          college_name?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_info?: string | null
          created_at?: string | null
          degree?: string | null
          education?: string | null
          email?: string
          experience_years?: number | null
          final_year_students?: number | null
          full_name?: string
          github_url?: string | null
          hiring_needs?: string | null
          id?: string
          institution_name?: string | null
          is_deleted?: boolean
          is_verified?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          placement_officer_contact?: string | null
          portfolio_url?: string | null
          profile_complete?: boolean | null
          project_description?: string | null
          resume_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_cost: number | null
          budget: number | null
          client: string | null
          company_id: string | null
          created_at: string | null
          department: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          priority: string | null
          progress_percentage: number | null
          start_date: string
          status: string | null
          team_lead: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          budget?: number | null
          client?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          priority?: string | null
          progress_percentage?: number | null
          start_date: string
          status?: string | null
          team_lead?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          budget?: number | null
          client?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          priority?: string | null
          progress_percentage?: number | null
          start_date?: string
          status?: string | null
          team_lead?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recruiter_dashboards: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      recruiters: {
        Row: {
          company_description: string | null
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          created_at: string | null
          email: string
          first_name: string
          id: number
          is_verified: boolean | null
          job_title: string | null
          last_name: string
          linkedin_url: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
        }
        Insert: {
          company_description?: string | null
          company_logo_url?: string | null
          company_name: string
          company_website?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: never
          is_verified?: boolean | null
          job_title?: string | null
          last_name: string
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
        }
        Update: {
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_website?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: never
          is_verified?: boolean | null
          job_title?: string | null
          last_name?: string
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          contract_id: string | null
          created_at: string | null
          id: string
          rating: number
          review_type: string
          reviewee_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          contract_id?: string | null
          created_at?: string | null
          id?: string
          rating: number
          review_type: string
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          contract_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          review_type?: string
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "freelance_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          company_id: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          plan_name: Database["public"]["Enums"]["subscription_plan"]
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          company_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_name: Database["public"]["Enums"]["subscription_plan"]
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          company_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_name?: Database["public"]["Enums"]["subscription_plan"]
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assignee: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          percentage: number | null
          score: number | null
          started_at: string | null
          test_id: string | null
          time_taken_minutes: number | null
          total_score: number | null
          user_id: string | null
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          id?: string
          percentage?: number | null
          score?: number | null
          started_at?: string | null
          test_id?: string | null
          time_taken_minutes?: number | null
          total_score?: number | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          percentage?: number | null
          score?: number | null
          started_at?: string | null
          test_id?: string | null
          time_taken_minutes?: number | null
          total_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_public: boolean | null
          job_id: string | null
          passing_score: number | null
          questions: Json
          test_type: Database["public"]["Enums"]["test_type"]
          title: string
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_public?: boolean | null
          job_id?: string | null
          passing_score?: number | null
          questions?: Json
          test_type: Database["public"]["Enums"]["test_type"]
          title: string
          total_questions?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_public?: boolean | null
          job_id?: string | null
          passing_score?: number | null
          questions?: Json
          test_type?: Database["public"]["Enums"]["test_type"]
          title?: string
          total_questions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tests_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          id: string
          proficiency_level: string
          skill_id: string | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          years_of_experience: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency_level: string
          skill_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          years_of_experience?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency_level?: string
          skill_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_recruiter_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_description: string | null
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          created_at: string | null
          email: string
          first_name: string
          id: number
          is_verified: boolean | null
          job_title: string | null
          last_name: string
          linkedin_url: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
        }[]
      }
      post_job: {
        Args: {
          p_title: string
          p_description: string
          p_company: string
          p_location: string
          p_job_type: string
          p_salary_min?: number
          p_salary_max?: number
          p_salary_currency?: string
          p_application_url?: string
          p_skills?: string[]
          p_experience_level?: string
          p_education_level?: string
          p_application_deadline?: string
        }
        Returns: number
      }
      register_recruiter: {
        Args: {
          p_first_name: string
          p_last_name: string
          p_email: string
          p_phone: string
          p_company_name: string
          p_company_website?: string
          p_company_logo_url?: string
          p_company_description?: string
          p_job_title?: string
          p_linkedin_url?: string
        }
        Returns: number
      }
      validate_dashboard_access: {
        Args: { dashboard_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "applied"
        | "shortlisted"
        | "interviewed"
        | "selected"
        | "rejected"
      attendance_status:
        | "present"
        | "absent"
        | "half_day"
        | "work_from_home"
        | "on_leave"
      communication_type: "email" | "sms" | "in_app" | "whatsapp"
      document_type:
        | "resume"
        | "id_proof"
        | "address_proof"
        | "education_cert"
        | "experience_cert"
        | "offer_letter"
        | "contract"
        | "other"
      employment_status:
        | "active"
        | "inactive"
        | "terminated"
        | "on_leave"
        | "probation"
      interview_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      interview_type: "phone" | "video" | "in_person" | "ai_powered"
      job_status: "active" | "closed" | "draft"
      job_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "freelance"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      leave_type:
        | "sick"
        | "casual"
        | "earned"
        | "maternity"
        | "paternity"
        | "bereavement"
        | "emergency"
      project_status:
        | "open"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "on_hold"
      subscription_plan: "free" | "basic" | "premium" | "enterprise"
      test_type: "technical" | "aptitude" | "domain_specific" | "ai_interview"
      user_role:
        | "jobseeker"
        | "recruiter"
        | "freelancer"
        | "client"
        | "college"
        | "student"
        | "admin"
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
      application_status: [
        "applied",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
      ],
      attendance_status: [
        "present",
        "absent",
        "half_day",
        "work_from_home",
        "on_leave",
      ],
      communication_type: ["email", "sms", "in_app", "whatsapp"],
      document_type: [
        "resume",
        "id_proof",
        "address_proof",
        "education_cert",
        "experience_cert",
        "offer_letter",
        "contract",
        "other",
      ],
      employment_status: [
        "active",
        "inactive",
        "terminated",
        "on_leave",
        "probation",
      ],
      interview_status: ["scheduled", "in_progress", "completed", "cancelled"],
      interview_type: ["phone", "video", "in_person", "ai_powered"],
      job_status: ["active", "closed", "draft"],
      job_type: [
        "full_time",
        "part_time",
        "contract",
        "internship",
        "freelance",
      ],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      leave_type: [
        "sick",
        "casual",
        "earned",
        "maternity",
        "paternity",
        "bereavement",
        "emergency",
      ],
      project_status: [
        "open",
        "in_progress",
        "completed",
        "cancelled",
        "on_hold",
      ],
      subscription_plan: ["free", "basic", "premium", "enterprise"],
      test_type: ["technical", "aptitude", "domain_specific", "ai_interview"],
      user_role: [
        "jobseeker",
        "recruiter",
        "freelancer",
        "client",
        "college",
        "student",
        "admin",
      ],
    },
  },
} as const
