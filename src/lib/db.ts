import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'impactsetu.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let clientInstance: Client | null = null;

export function getDb(): Client {
  if (!clientInstance) {
    clientInstance = createClient({
      url: `file:${dbPath}`,
    });
  }
  return clientInstance;
}

export async function initDbSchema() {
  const db = getDb();
  const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const statements = schemaSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.execute(stmt);
    }
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'STUDENT' | 'NGO';
  college_name?: string | null;
  skills?: string | null;
  contact_info?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  description: string;
  cause_category: string;
  location: string;
  date: string;
  duration_hours: number;
  required_volunteers: number;
  image_url: string;
  requirements?: string | null;
  created_at: string;
  registered_count?: number;
  is_registered?: boolean;
  is_bookmarked?: boolean;
}

export interface Registration {
  id: string;
  student_id: string;
  campaign_id: string;
  status: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  registered_at: string;
  student_name?: string;
  student_email?: string;
  student_college?: string;
  student_skills?: string;
  student_contact?: string;
  student_avatar?: string;
  campaign_title?: string;
  campaign_cause?: string;
  campaign_location?: string;
  campaign_date?: string;
  campaign_duration?: number;
  campaign_ngo_name?: string;
  campaign_image?: string;
}

export interface Bookmark {
  id: string;
  student_id: string;
  campaign_id: string;
  created_at: string;
}

// User Helpers
export async function getAllUsers(): Promise<User[]> {
  const db = getDb();
  const res = await db.execute(`SELECT * FROM users ORDER BY created_at DESC`);
  return res.rows as unknown as User[];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = getDb();
  const res = await db.execute({ sql: `SELECT * FROM users WHERE id = ?`, args: [id] });
  return (res.rows[0] as unknown as User) || undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = getDb();
  const res = await db.execute({ sql: `SELECT * FROM users WHERE email = ?`, args: [email] });
  return (res.rows[0] as unknown as User) || undefined;
}

export async function createUser(user: Omit<User, 'created_at'>): Promise<User> {
  const db = getDb();
  await db.execute({
    sql: `
      INSERT INTO users (id, name, email, password_hash, role, college_name, skills, contact_info, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      user.id,
      user.name,
      user.email,
      user.password_hash,
      user.role,
      user.college_name || null,
      user.skills || null,
      user.contact_info || null,
      user.avatar_url || null,
    ],
  });
  return (await getUserById(user.id))!;
}

// Campaign Helpers
export async function getCampaigns(filters?: {
  search?: string;
  cause?: string;
  location?: string;
  date?: string;
  duration?: string;
  student_id?: string;
}): Promise<Campaign[]> {
  const db = getDb();
  let sql = `
    SELECT c.*, 
      (SELECT COUNT(*) FROM registrations r WHERE r.campaign_id = c.id AND r.status != 'CANCELLED') as registered_count
  `;

  if (filters?.student_id) {
    sql += `,
      EXISTS(SELECT 1 FROM registrations r WHERE r.campaign_id = c.id AND r.student_id = '${filters.student_id}' AND r.status != 'CANCELLED') as is_registered,
      EXISTS(SELECT 1 FROM bookmarks b WHERE b.campaign_id = c.id AND b.student_id = '${filters.student_id}') as is_bookmarked
    `;
  } else {
    sql += `, 0 as is_registered, 0 as is_bookmarked`;
  }

  sql += ` FROM campaigns c WHERE 1=1`;

  const args: any[] = [];

  if (filters?.search) {
    sql += ` AND (c.title LIKE ? OR c.description LIKE ? OR c.ngo_name LIKE ? OR c.location LIKE ?)`;
    const searchParam = `%${filters.search}%`;
    args.push(searchParam, searchParam, searchParam, searchParam);
  }

  if (filters?.cause && filters.cause !== 'ALL') {
    sql += ` AND c.cause_category = ?`;
    args.push(filters.cause);
  }

  if (filters?.location && filters.location !== 'ALL') {
    sql += ` AND c.location LIKE ?`;
    args.push(`%${filters.location}%`);
  }

  if (filters?.date) {
    sql += ` AND c.date >= ?`;
    args.push(filters.date);
  }

  if (filters?.duration && filters.duration !== 'ALL') {
    if (filters.duration === 'SHORT') {
      sql += ` AND c.duration_hours <= 3`;
    } else if (filters.duration === 'MEDIUM') {
      sql += ` AND c.duration_hours BETWEEN 4 AND 5`;
    } else if (filters.duration === 'LONG') {
      sql += ` AND c.duration_hours >= 6`;
    }
  }

  sql += ` ORDER BY c.date ASC`;

  const res = await db.execute({ sql, args });
  return (res.rows as any[]).map((r) => ({
    ...r,
    duration_hours: Number(r.duration_hours),
    required_volunteers: Number(r.required_volunteers),
    registered_count: Number(r.registered_count),
    is_registered: Boolean(r.is_registered),
    is_bookmarked: Boolean(r.is_bookmarked),
  }));
}

export async function getCampaignById(id: string, studentId?: string): Promise<Campaign | undefined> {
  const db = getDb();
  let sql = `
    SELECT c.*, 
      (SELECT COUNT(*) FROM registrations r WHERE r.campaign_id = c.id AND r.status != 'CANCELLED') as registered_count
  `;

  if (studentId) {
    sql += `,
      EXISTS(SELECT 1 FROM registrations r WHERE r.campaign_id = c.id AND r.student_id = '${studentId}' AND r.status != 'CANCELLED') as is_registered,
      EXISTS(SELECT 1 FROM bookmarks b WHERE b.campaign_id = c.id AND b.student_id = '${studentId}') as is_bookmarked
    `;
  } else {
    sql += `, 0 as is_registered, 0 as is_bookmarked`;
  }

  sql += ` FROM campaigns c WHERE c.id = ?`;

  const res = await db.execute({ sql, args: [id] });
  const row = res.rows[0] as any;
  if (!row) return undefined;
  return {
    ...row,
    duration_hours: Number(row.duration_hours),
    required_volunteers: Number(row.required_volunteers),
    registered_count: Number(row.registered_count),
    is_registered: Boolean(row.is_registered),
    is_bookmarked: Boolean(row.is_bookmarked),
  };
}

export async function createCampaign(campaign: Omit<Campaign, 'created_at'>): Promise<Campaign> {
  const db = getDb();
  await db.execute({
    sql: `
      INSERT INTO campaigns (id, ngo_id, ngo_name, title, description, cause_category, location, date, duration_hours, required_volunteers, image_url, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      campaign.id,
      campaign.ngo_id,
      campaign.ngo_name,
      campaign.title,
      campaign.description,
      campaign.cause_category,
      campaign.location,
      campaign.date,
      campaign.duration_hours,
      campaign.required_volunteers,
      campaign.image_url,
      campaign.requirements || null,
    ],
  });
  return (await getCampaignById(campaign.id))!;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
  const db = getDb();
  const current = await getCampaignById(id);
  if (!current) return undefined;

  const updated = { ...current, ...updates };
  await db.execute({
    sql: `
      UPDATE campaigns 
      SET title = ?, description = ?, cause_category = ?, location = ?, date = ?, duration_hours = ?, required_volunteers = ?, image_url = ?, requirements = ?
      WHERE id = ?
    `,
    args: [
      updated.title,
      updated.description,
      updated.cause_category,
      updated.location,
      updated.date,
      updated.duration_hours,
      updated.required_volunteers,
      updated.image_url,
      updated.requirements || null,
      id,
    ],
  });
  return await getCampaignById(id);
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const db = getDb();
  const res = await db.execute({ sql: `DELETE FROM campaigns WHERE id = ?`, args: [id] });
  return res.rowsAffected > 0;
}

// Registration Helpers
export async function registerStudent(studentId: string, campaignId: string): Promise<Registration> {
  const db = getDb();
  const id = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const existingRes = await db.execute({
    sql: `SELECT * FROM registrations WHERE student_id = ? AND campaign_id = ?`,
    args: [studentId, campaignId],
  });
  const existing = existingRes.rows[0] as unknown as Registration | undefined;

  if (existing) {
    await db.execute({
      sql: `UPDATE registrations SET status = 'REGISTERED', registered_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [existing.id],
    });
    return (await getRegistrationById(existing.id))!;
  }

  await db.execute({
    sql: `INSERT INTO registrations (id, student_id, campaign_id, status) VALUES (?, ?, ?, 'REGISTERED')`,
    args: [id, studentId, campaignId],
  });
  return (await getRegistrationById(id))!;
}

export async function cancelRegistration(studentId: string, campaignId: string): Promise<boolean> {
  const db = getDb();
  const res = await db.execute({
    sql: `UPDATE registrations SET status = 'CANCELLED' WHERE student_id = ? AND campaign_id = ?`,
    args: [studentId, campaignId],
  });
  return res.rowsAffected > 0;
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED'
): Promise<Registration | undefined> {
  const db = getDb();
  await db.execute({
    sql: `UPDATE registrations SET status = ? WHERE id = ?`,
    args: [status, registrationId],
  });
  return await getRegistrationById(registrationId);
}

export async function getRegistrationById(id: string): Promise<Registration | undefined> {
  const db = getDb();
  const res = await db.execute({
    sql: `
      SELECT r.*, 
        u.name as student_name, u.email as student_email, u.college_name as student_college, u.skills as student_skills, u.contact_info as student_contact, u.avatar_url as student_avatar,
        c.title as campaign_title, c.cause_category as campaign_cause, c.location as campaign_location, c.date as campaign_date, c.duration_hours as campaign_duration, c.ngo_name as campaign_ngo_name, c.image_url as campaign_image
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      JOIN campaigns c ON r.campaign_id = c.id
      WHERE r.id = ?
    `,
    args: [id],
  });
  const row = res.rows[0] as any;
  if (!row) return undefined;
  return {
    ...row,
    campaign_duration: Number(row.campaign_duration),
  };
}

export async function getStudentRegistrations(studentId: string): Promise<Registration[]> {
  const db = getDb();
  const res = await db.execute({
    sql: `
      SELECT r.*, 
        c.title as campaign_title, c.cause_category as campaign_cause, c.location as campaign_location, c.date as campaign_date, c.duration_hours as campaign_duration, c.ngo_name as campaign_ngo_name, c.image_url as campaign_image
      FROM registrations r
      JOIN campaigns c ON r.campaign_id = c.id
      WHERE r.student_id = ? AND r.status != 'CANCELLED'
      ORDER BY c.date ASC
    `,
    args: [studentId],
  });
  return (res.rows as any[]).map((row) => ({
    ...row,
    campaign_duration: Number(row.campaign_duration),
  }));
}

export async function getNgoCampaignsWithApplicants(ngoId: string): Promise<{ campaign: Campaign; applicants: Registration[] }[]> {
  const db = getDb();
  const campaignRes = await db.execute({
    sql: `
      SELECT c.*, 
        (SELECT COUNT(*) FROM registrations r WHERE r.campaign_id = c.id AND r.status != 'CANCELLED') as registered_count
      FROM campaigns c 
      WHERE c.ngo_id = ? 
      ORDER BY c.created_at DESC
    `,
    args: [ngoId],
  });

  const campaigns = (campaignRes.rows as any[]).map((r) => ({
    ...r,
    duration_hours: Number(r.duration_hours),
    required_volunteers: Number(r.required_volunteers),
    registered_count: Number(r.registered_count),
  }));

  const result = [];
  for (const campaign of campaigns) {
    const applicantRes = await db.execute({
      sql: `
        SELECT r.*, 
          u.name as student_name, u.email as student_email, u.college_name as student_college, u.skills as student_skills, u.contact_info as student_contact, u.avatar_url as student_avatar
        FROM registrations r
        JOIN users u ON r.student_id = u.id
        WHERE r.campaign_id = ? AND r.status != 'CANCELLED'
        ORDER BY r.registered_at DESC
      `,
      args: [campaign.id],
    });
    result.push({
      campaign,
      applicants: applicantRes.rows as unknown as Registration[],
    });
  }

  return result;
}

// Bookmark Helpers
export async function toggleBookmark(studentId: string, campaignId: string): Promise<boolean> {
  const db = getDb();
  const existingRes = await db.execute({
    sql: `SELECT * FROM bookmarks WHERE student_id = ? AND campaign_id = ?`,
    args: [studentId, campaignId],
  });

  if (existingRes.rows.length > 0) {
    await db.execute({
      sql: `DELETE FROM bookmarks WHERE student_id = ? AND campaign_id = ?`,
      args: [studentId, campaignId],
    });
    return false;
  } else {
    const id = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO bookmarks (id, student_id, campaign_id) VALUES (?, ?, ?)`,
      args: [id, studentId, campaignId],
    });
    return true;
  }
}

export async function getStudentBookmarks(studentId: string): Promise<Campaign[]> {
  const db = getDb();
  const res = await db.execute({
    sql: `
      SELECT c.*, 
        (SELECT COUNT(*) FROM registrations r WHERE r.campaign_id = c.id AND r.status != 'CANCELLED') as registered_count,
        1 as is_bookmarked,
        EXISTS(SELECT 1 FROM registrations r WHERE r.campaign_id = c.id AND r.student_id = ? AND r.status != 'CANCELLED') as is_registered
      FROM bookmarks b
      JOIN campaigns c ON b.campaign_id = c.id
      WHERE b.student_id = ?
      ORDER BY b.created_at DESC
    `,
    args: [studentId, studentId],
  });
  return (res.rows as any[]).map((r) => ({
    ...r,
    duration_hours: Number(r.duration_hours),
    required_volunteers: Number(r.required_volunteers),
    registered_count: Number(r.registered_count),
    is_bookmarked: true,
    is_registered: Boolean(r.is_registered),
  }));
}
