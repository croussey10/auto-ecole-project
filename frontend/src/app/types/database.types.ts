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
      achat_historique: {
        Row: {
          auto_ecole_id: string
          date_achat: string
          eleve_id: string
          forfait_heures: number
          forfait_id: string | null
          forfait_nom: string
          id: string
          prix_paye: number
          statut_paiement: string
        }
        Insert: {
          auto_ecole_id: string
          date_achat?: string
          eleve_id: string
          forfait_heures?: number
          forfait_id?: string | null
          forfait_nom?: string
          id?: string
          prix_paye: number
          statut_paiement?: string
        }
        Update: {
          auto_ecole_id?: string
          date_achat?: string
          eleve_id?: string
          forfait_heures?: number
          forfait_id?: string | null
          forfait_nom?: string
          id?: string
          prix_paye?: number
          statut_paiement?: string
        }
        Relationships: [
          {
            foreignKeyName: "achat_historique_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achat_historique_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achat_historique_forfait_id_fkey"
            columns: ["forfait_id"]
            isOneToOne: false
            referencedRelation: "forfait"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_ecole: {
        Row: {
          created_at: string
          id: string
          nom: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      competence: {
        Row: {
          category: Database["public"]["Enums"]["categorie_maitrise"] | null
          created_at: string
          id: string
          nom: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["categorie_maitrise"] | null
          created_at?: string
          id?: string
          nom: string
        }
        Update: {
          category?: Database["public"]["Enums"]["categorie_maitrise"] | null
          created_at?: string
          id?: string
          nom?: string
        }
        Relationships: []
      }
      document: {
        Row: {
          auto_ecole_id: string
          date_upload: string
          fichier_url: string
          id: string
          profile_id: string
          statut: Database["public"]["Enums"]["statut_document"]
          type_doc: Database["public"]["Enums"]["type_document"]
          updated_at: string
        }
        Insert: {
          auto_ecole_id: string
          date_upload?: string
          fichier_url: string
          id?: string
          profile_id: string
          statut?: Database["public"]["Enums"]["statut_document"]
          type_doc: Database["public"]["Enums"]["type_document"]
          updated_at?: string
        }
        Update: {
          auto_ecole_id?: string
          date_upload?: string
          fichier_url?: string
          id?: string
          profile_id?: string
          statut?: Database["public"]["Enums"]["statut_document"]
          type_doc?: Database["public"]["Enums"]["type_document"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      forfait: {
        Row: {
          auto_ecole_id: string
          created_at: string
          description: string | null
          id: string
          is_forfait: boolean | null
          nom: string
          nombre_heures: number
          prix: number
          updated_at: string
        }
        Insert: {
          auto_ecole_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_forfait?: boolean | null
          nom: string
          nombre_heures: number
          prix: number
          updated_at?: string
        }
        Update: {
          auto_ecole_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_forfait?: boolean | null
          nom?: string
          nombre_heures?: number
          prix?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forfait_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
        ]
      }
      livret_apprentissage: {
        Row: {
          auto_ecole_id: string
          competence_id: string
          created_at: string
          eleve_id: string
          id: string
          maitrise: Database["public"]["Enums"]["niveau_maitrise"]
          updated_at: string
        }
        Insert: {
          auto_ecole_id: string
          competence_id: string
          created_at?: string
          eleve_id: string
          id?: string
          maitrise?: Database["public"]["Enums"]["niveau_maitrise"]
          updated_at?: string
        }
        Update: {
          auto_ecole_id?: string
          competence_id?: string
          created_at?: string
          eleve_id?: string
          id?: string
          maitrise?: Database["public"]["Enums"]["niveau_maitrise"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "livret_apprentissage_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livret_apprentissage_competence_id_fkey"
            columns: ["competence_id"]
            isOneToOne: false
            referencedRelation: "competence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livret_apprentissage_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      log_action: {
        Row: {
          action: Database["public"]["Enums"]["action_type"]
          auto_ecole_id: string
          created_at: string
          details: string
          id: string
          profile_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["action_type"]
          auto_ecole_id: string
          created_at?: string
          details: string
          id?: string
          profile_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["action_type"]
          auto_ecole_id?: string
          created_at?: string
          details?: string
          id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_action_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "log_action_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          auto_ecole_id: string
          created_at: string
          date_naissance: string | null
          forfait_id: string | null
          heures_effectuees: number | null
          heures_restantes: number
          id: string
          nom: string
          prenom: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_ecole_id: string
          created_at?: string
          date_naissance?: string | null
          forfait_id?: string | null
          heures_effectuees?: number | null
          heures_restantes?: number
          id?: string
          nom: string
          prenom: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_ecole_id?: string
          created_at?: string
          date_naissance?: string | null
          forfait_id?: string | null
          heures_effectuees?: number | null
          heures_restantes?: number
          id?: string
          nom?: string
          prenom?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_forfait_id_fkey"
            columns: ["forfait_id"]
            isOneToOne: false
            referencedRelation: "forfait"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation: {
        Row: {
          auto_ecole_id: string
          commentaire_moniteur: string | null
          created_at: string
          date_creneau: string
          eleve_id: string | null
          heure_debut: string
          id: string
          is_manuelle: boolean
          is_reserved: boolean
          moniteur_id: string
          updated_at: string
          vehicule: string | null
        }
        Insert: {
          auto_ecole_id: string
          commentaire_moniteur?: string | null
          created_at?: string
          date_creneau: string
          eleve_id?: string | null
          heure_debut: string
          id?: string
          is_manuelle?: boolean
          is_reserved?: boolean
          moniteur_id: string
          updated_at?: string
          vehicule?: string | null
        }
        Update: {
          auto_ecole_id?: string
          commentaire_moniteur?: string | null
          created_at?: string
          date_creneau?: string
          eleve_id?: string | null
          heure_debut?: string
          id?: string
          is_manuelle?: boolean
          is_reserved?: boolean
          moniteur_id?: string
          updated_at?: string
          vehicule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_moniteur_id_fkey"
            columns: ["moniteur_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_livret_competence: {
        Row: {
          auto_ecole_id: string | null
          categorie: Database["public"]["Enums"]["categorie_maitrise"] | null
          competence_id: string | null
          competence_nom: string | null
          eleve_id: string | null
          id: string | null
          maitrise: Database["public"]["Enums"]["niveau_maitrise"] | null
        }
        Relationships: [
          {
            foreignKeyName: "livret_apprentissage_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livret_apprentissage_competence_id_fkey"
            columns: ["competence_id"]
            isOneToOne: false
            referencedRelation: "competence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livret_apprentissage_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      view_reservation: {
        Row: {
          auto_ecole_id: string | null
          commentaire_moniteur: string | null
          date_creneau: string | null
          eleve_id: string | null
          eleve_nom: string | null
          eleve_prenom: string | null
          heure_debut: string | null
          id: string | null
          is_manuelle: boolean | null
          is_reserved: boolean | null
          moniteur_id: string | null
          moniteur_nom: string | null
          moniteur_prenom: string | null
          vehicule: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_auto_ecole_id_fkey"
            columns: ["auto_ecole_id"]
            isOneToOne: false
            referencedRelation: "auto_ecole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_moniteur_id_fkey"
            columns: ["moniteur_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_my_auto_ecole_id: { Args: never; Returns: string }
      valider_achat_forfait: {
        Args: { p_eleve_id: string; p_forfait_id: string }
        Returns: undefined
      }
    }
    Enums: {
      action_type:
        | "AUTH_LOGIN"
        | "AUTH_REGISTER"
        | "RESERVATION_CREATE"
        | "RESERVATION_CANCEL"
        | "DOCUMENT_UPLOAD"
        | "DOCUMENT_VALIDATE"
        | "ROLE_UPDATE"
      categorie_maitrise: "Maîtriser" | "Appréhender" | "Pratiquer" | "Circuler"
      niveau_maitrise: "A revoir" | "Moyen" | "Acquis" | "Neutre"
      statut_document: "En_attente" | "Valide" | "Refuse"
      type_document: "CNI" | "ANTS" | "Permis" | "Justificatif_Domicile"
      user_role: "eleve" | "moniteur" | "admin"
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
      action_type: [
        "AUTH_LOGIN",
        "AUTH_REGISTER",
        "RESERVATION_CREATE",
        "RESERVATION_CANCEL",
        "DOCUMENT_UPLOAD",
        "DOCUMENT_VALIDATE",
        "ROLE_UPDATE",
      ],
      categorie_maitrise: ["Maîtriser", "Appréhender", "Pratiquer", "Circuler"],
      niveau_maitrise: ["A revoir", "Moyen", "Acquis", "Neutre"],
      statut_document: ["En_attente", "Valide", "Refuse"],
      type_document: ["CNI", "ANTS", "Permis", "Justificatif_Domicile"],
      user_role: ["eleve", "moniteur", "admin"],
    },
  },
} as const
