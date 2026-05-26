import { inject, Injectable } from '@angular/core'
import { SupabaseService } from '../supabase/supabase-service'
import { Database } from '../../../types/database.types'

@Injectable({
  providedIn: 'root',
})
export class AutoEcoleService {
  supabase = inject(SupabaseService)

  async getAutoEcoleInfos(
    value: string | undefined | null,
    type: 'id' | 'slug',
  ): Promise<Database['public']['Tables']['auto_ecole']['Row']> {
    const { data, error } = await this.supabase.supabase
      .from('auto_ecole')
      .select('*')
      .eq(type, value)
      .single()
    if (error) throw error
    return data
  }
}
