import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Asset = Database["public"]["Tables"]["assets"]["Row"];
export type Lyric = Database["public"]["Tables"]["lyrics"]["Row"];
export type Style = Database["public"]["Tables"]["styles"]["Row"];
export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];
export type CalendarPost = Database["public"]["Tables"]["calendar_posts"]["Row"];

export type AssetType = "audio" | "video" | "image" | "cover";

// -------- projects --------
export async function listProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*, styles(name, tag, gradient)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*, styles(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProject(input: {
  title: string;
  artist?: string;
  release_info?: string;
  user_id: string;
}) {
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, patch: Database["public"]["Tables"]["projects"]["Update"]) {
  const { data, error } = await supabase.from("projects").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// -------- assets --------
export async function listAssets(projectId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

function assetKindFromFile(file: File): AssetType {
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

export async function uploadAsset(params: {
  file: File;
  projectId: string;
  userId: string;
  type?: AssetType;
}): Promise<Asset> {
  const kind = params.type ?? assetKindFromFile(params.file);
  const safeName = params.file.name.replace(/[^\w.\-]/g, "_");
  const path = `${params.userId}/${params.projectId}/${crypto.randomUUID()}-${safeName}`;
  const { error: upErr } = await supabase.storage
    .from("project-assets")
    .upload(path, params.file, { contentType: params.file.type || undefined, upsert: false });
  if (upErr) throw upErr;

  // Store the storage path as file_url reference; UI resolves via signed URL on demand.
  const { data, error } = await supabase
    .from("assets")
    .insert({
      project_id: params.projectId,
      user_id: params.userId,
      type: kind,
      file_url: path,
      storage_path: path,
      file_name: params.file.name,
      file_size: params.file.size,
      mime_type: params.file.type || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAssetSignedUrl(path: string, expiresIn = 60 * 60) {
  const { data, error } = await supabase.storage.from("project-assets").createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteAsset(asset: Asset) {
  if (asset.storage_path) {
    await supabase.storage.from("project-assets").remove([asset.storage_path]);
  }
  const { error } = await supabase.from("assets").delete().eq("id", asset.id);
  if (error) throw error;
}

// -------- lyrics --------
export async function listLyrics(projectId: string) {
  const { data, error } = await supabase
    .from("lyrics")
    .select("*")
    .eq("project_id", projectId)
    .order("line_index", { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertLyricLine(row: Database["public"]["Tables"]["lyrics"]["Insert"]) {
  const { data, error } = await supabase.from("lyrics").upsert(row).select().single();
  if (error) throw error;
  return data;
}

export async function updateLyric(id: string, patch: Database["public"]["Tables"]["lyrics"]["Update"]) {
  const { data, error } = await supabase.from("lyrics").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteLyric(id: string) {
  const { error } = await supabase.from("lyrics").delete().eq("id", id);
  if (error) throw error;
}

// -------- styles --------
export async function listStyles() {
  const { data, error } = await supabase
    .from("styles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

// -------- content items --------
export async function listContentItems(projectId: string) {
  const { data, error } = await supabase
    .from("content_items")
    .select("*, styles(name, tag, gradient)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createContentItem(row: Database["public"]["Tables"]["content_items"]["Insert"]) {
  const { data, error } = await supabase.from("content_items").insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function updateContentItem(id: string, patch: Database["public"]["Tables"]["content_items"]["Update"]) {
  const { data, error } = await supabase.from("content_items").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteContentItem(id: string) {
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) throw error;
}

// -------- calendar --------
export async function listCalendarPosts(projectId: string) {
  const { data, error } = await supabase
    .from("calendar_posts")
    .select("*, content_items(title, type, preview_url, style_id)")
    .eq("project_id", projectId)
    .order("scheduled_for", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data;
}

export async function createCalendarPost(row: Database["public"]["Tables"]["calendar_posts"]["Insert"]) {
  const { data, error } = await supabase.from("calendar_posts").insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function updateCalendarPost(id: string, patch: Database["public"]["Tables"]["calendar_posts"]["Update"]) {
  const { data, error } = await supabase.from("calendar_posts").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCalendarPost(id: string) {
  const { error } = await supabase.from("calendar_posts").delete().eq("id", id);
  if (error) throw error;
}