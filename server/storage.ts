import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Publication, InsertPublication, UpdatePublication, Setting, InsertSetting } from '@shared/schema';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface IStorage {
  // Publications (public client)
  getAllPublications(): Promise<Publication[]>;
  getPublication(id: string): Promise<Publication | null>;
  
  // Publications (authenticated client)
  createPublicationWithClient(client: SupabaseClient, data: InsertPublication): Promise<Publication>;
  updatePublicationWithClient(client: SupabaseClient, id: string, data: UpdatePublication): Promise<Publication>;
  deletePublicationWithClient(client: SupabaseClient, id: string): Promise<void>;

  // Settings (public client)
  getSetting(key: string): Promise<Setting | null>;
  getAllSettings(): Promise<Setting[]>;
  
  // Settings (authenticated client)
  setSettingWithClient(client: SupabaseClient, data: InsertSetting): Promise<Setting>;
}

export class SupabaseStorage implements IStorage {
  // Publications
  async getAllPublications(): Promise<Publication[]> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async getPublication(id: string): Promise<Publication | null> {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }
    return data;
  }

  async createPublicationWithClient(client: SupabaseClient, insertData: InsertPublication): Promise<Publication> {
    const { data, error } = await client
      .from('publications')
      .insert({
        title: insertData.title,
        description: insertData.description,
        image_url: insertData.imageUrl,
        monthly_price: insertData.monthlyPrice,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      monthlyPrice: data.monthly_price,
      createdAt: data.created_at,
    };
  }

  async updatePublicationWithClient(client: SupabaseClient, id: string, updateData: UpdatePublication): Promise<Publication> {
    const updates: any = {};
    if (updateData.title !== undefined) updates.title = updateData.title;
    if (updateData.description !== undefined) updates.description = updateData.description;
    if (updateData.imageUrl !== undefined) updates.image_url = updateData.imageUrl;
    if (updateData.monthlyPrice !== undefined) updates.monthly_price = updateData.monthlyPrice;

    const { data, error } = await client
      .from('publications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      monthlyPrice: data.monthly_price,
      createdAt: data.created_at,
    };
  }

  async deletePublicationWithClient(client: SupabaseClient, id: string): Promise<void> {
    const { error } = await client
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // Settings
  async getSetting(key: string): Promise<Setting | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }
    return data;
  }

  async setSettingWithClient(client: SupabaseClient, insertData: InsertSetting): Promise<Setting> {
    const { data, error } = await client
      .from('settings')
      .upsert(
        { key: insertData.key, value: insertData.value },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllSettings(): Promise<Setting[]> {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw new Error(error.message);
    return data || [];
  }
}

export const storage = new SupabaseStorage();
