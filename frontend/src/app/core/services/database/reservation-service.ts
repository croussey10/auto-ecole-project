import {inject, Injectable} from '@angular/core';
import {SupabaseService} from '../supabase/supabase-service';
import {Database} from '../../../types/database.types';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  supabase = inject(SupabaseService)

  async getEleveReservations(profileId: string): Promise<Database["public"]["Tables"]["reservation"]["Row"][]> {
    const {data, error} = await this.supabase.supabase
      .from('reservation')
      .select('*')
      .eq('eleve_id', profileId)
    if (error) throw error
    return data
  }
}
