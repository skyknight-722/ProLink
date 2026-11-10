/**
 * ProjectLink — Supabase Integration Architecture & Client Adapter
 * Backend configuration connected directly to user's Supabase project.
 */

const SUPABASE_DEFAULT_CONFIG = {
  url: 'https://aezrpiggzhohgvianxqz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlenJwaWdnemhvaGd2aWFueHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzMTEyMjQsImV4cCI6MjEwOTg4NzIyNH0.MxPl3CM3H6wobUfMVsD_9CtVpL-d3P3ZrYMB_PQguwk',
  enabled: true
};

class SupabaseAdapter {
  constructor() {
    this.client = null;
    this.url = SUPABASE_DEFAULT_CONFIG.url;
    this.anonKey = SUPABASE_DEFAULT_CONFIG.anonKey;
    this.activeSubscriptions = new Map();
    this.init();
  }

  isConfigured() {
    return Boolean(
      this.url &&
      this.anonKey &&
      this.url.startsWith('https://') &&
      !this.url.includes('YOUR_SUPABASE_PROJECT_ID') &&
      this.anonKey.length > 20
    );
  }

  init() {
    if (this.isConfigured() && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        console.log('[SUPABASE] 🚀 Connected to ProjectLink Supabase backend:', this.url);
      } catch (err) {
        console.error('[SUPABASE] Connection initialization failed:', err);
        this.client = null;
      }
    } else {
      console.log('[SUPABASE] ⚡ Standby mode: using ultra-fast local state engine.');
    }
  }

  async testConnection() {
    if (!this.client) {
      this.init();
    }
    if (!this.client) {
      return { success: false, message: 'Supabase mijozi ishga tushmadi.' };
    }
    try {
      const { data, error } = await this.client.from('projects').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        if (error.message && error.message.includes('relation "public.projects" does not exist')) {
          return {
            success: true,
            warning: true,
            message: 'Supabase bilan aloqa muvaffaqiyatli, ammo jadvallar hali yaratilmagan. supabase-schema.sql skriptini Supabase SQL Editor-da bajaring.'
          };
        }
      }
      return { success: true, message: 'Supabase bulutli ma’lumotlar bazasiga muvaffaqiyatli ulandi!' };
    } catch (err) {
      return { success: false, message: 'Ulanishda xatolik: ' + (err.message || err) };
    }
  }

  // --- AUTHENTICATION ---
  async signUp(email, password, metadata = {}) {
    if (!this.client) return null;
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata.name || email.split('@')[0],
          handle: metadata.handle || email.split('@')[0],
          role: metadata.role || 'user',
          title: metadata.title || 'Talaba / Dasturchi',
          university: metadata.university || ''
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async signIn(email, password) {
    if (!this.client) return null;
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.client) return null;
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    if (!this.client) return null;
    const { data, error } = await this.client.auth.getSession();
    if (error) return null;
    return data.session;
  }

  // --- PROFILES ---
  async fetchProfiles() {
    if (!this.client) return null;
    const { data, error } = await this.client.from('profiles').select('*');
    if (error) throw error;
    return data;
  }

  async updateProfile(userId, profileData) {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('profiles')
      .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() })
      .select();
    if (error) throw error;
    return data;
  }

  // --- PROJECTS ---
  async fetchProjects() {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createProject(project) {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('projects')
      .insert([project])
      .select();
    if (error) throw error;
    return data;
  }

  // --- APPLICATIONS ---
  async fetchApplications() {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async submitApplication(appData) {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('applications')
      .insert([appData])
      .select();
    if (error) throw error;
    return data;
  }

  async updateApplicationStatus(appId, status) {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('applications')
      .update({ status })
      .eq('id', appId)
      .select();
    if (error) throw error;
    return data;
  }

  // --- PROJECT MESSAGES (DISCORD CHANNELS) ---
  async fetchProjectMessages(projectId, channel = 'umumiy-chat') {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('project_messages')
      .select('*')
      .eq('project_id', projectId)
      .eq('channel', channel)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async sendProjectMessage(messageData) {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('project_messages')
      .insert([messageData])
      .select();
    if (error) throw error;
    return data;
  }

  subscribeToChannel(projectId, channel, onMessageReceived) {
    if (!this.client) return null;
    const subKey = `${projectId}:${channel}`;
    if (this.activeSubscriptions.has(subKey)) {
      this.client.removeChannel(this.activeSubscriptions.get(subKey));
    }

    const realtimeChannel = this.client
      .channel(`public:project_messages:${subKey}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_messages',
          filter: `project_id=eq.${projectId}`
        },
        payload => {
          if (payload.new && payload.new.channel === channel) {
            onMessageReceived(payload.new);
          }
        }
      )
      .subscribe();

    this.activeSubscriptions.set(subKey, realtimeChannel);
    return realtimeChannel;
  }
}

// Global Singleton
window.supabaseAdapter = new SupabaseAdapter();
