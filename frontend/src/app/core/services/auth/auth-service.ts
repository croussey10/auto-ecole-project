import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase-service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase = inject(SupabaseService).supabase;

  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange : ", event, session?.user)
      this.currentUser.set(session?.user ? session.user : null)
      if (event === 'INITIAL_SESSION' && !session?.user) {
        this.currentUser.set(null);
        localStorage.removeItem('activeAutoEcoleId');
        localStorage.removeItem('activeAutoEcoleSlug');
      }
    })
  }

  async loadCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();
    if (error) console.error(error);
    console.log('loadCurrentUser : ', this.currentUser())
    return user
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
}
