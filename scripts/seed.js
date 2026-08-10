const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'impactsetu.db');
const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const client = createClient({
  url: `file:${dbPath}`,
});

async function seed() {
  console.log('⚡ Initializing ImpactSetu Database Schema via @libsql/client...');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await client.execute(stmt);
  }

  console.log('🌱 Seeding realistic database entries...');

  await client.execute(`DELETE FROM bookmarks;`);
  await client.execute(`DELETE FROM registrations;`);
  await client.execute(`DELETE FROM campaigns;`);
  await client.execute(`DELETE FROM users;`);

  // Insert Users
  const users = [
    {
      id: 'usr_stu_1',
      name: 'Arun Kumar',
      email: 'arun.v@rnsit.ac.in',
      password_hash: 'hashed_password_123',
      role: 'STUDENT',
      college_name: 'RNSIT (R.N.S. Institute of Technology)',
      skills: JSON.stringify(['Teaching & Tutoring', 'Python Coding', 'Event Operations', 'Food Distribution']),
      contact_info: '+91 98450 12345',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_stu_2',
      name: 'Ananya Sharma',
      email: 'ananya.s@rvce.edu.in',
      password_hash: 'hashed_password_123',
      role: 'STUDENT',
      college_name: 'RV College of Engineering (RVCE)',
      skills: JSON.stringify(['Social Media Campaigning', 'First Aid', 'Public Speaking', 'Graphic Design']),
      contact_info: '+91 98451 23456',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_stu_3',
      name: 'Vikramaditya Gowda',
      email: 'vikram.g@bmsce.ac.in',
      password_hash: 'hashed_password_123',
      role: 'STUDENT',
      college_name: 'BMS College of Engineering (BMSCE)',
      skills: JSON.stringify(['Tree Plantation', 'Logistics', 'Crowd Control', 'Photography']),
      contact_info: '+91 98452 34567',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_stu_4',
      name: 'Priyanka Rao',
      email: 'priyanka.r@rnsit.ac.in',
      password_hash: 'hashed_password_123',
      role: 'STUDENT',
      college_name: 'RNSIT (R.N.S. Institute of Technology)',
      skills: JSON.stringify(['Digital Literacy', 'Web Development', 'Content Writing']),
      contact_info: '+91 98453 45678',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_ngo_1',
      name: 'Akshaya Patra Foundation',
      email: 'contact@akshayapatra-mock.org',
      password_hash: 'hashed_password_123',
      role: 'NGO',
      college_name: null,
      skills: null,
      contact_info: '+91 80 3001 2222',
      avatar_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_ngo_2',
      name: 'Youth For Seva Bengaluru',
      email: 'bengaluru@youthforseva-mock.org',
      password_hash: 'hashed_password_123',
      role: 'NGO',
      college_name: null,
      skills: null,
      contact_info: '+91 80 2660 4123',
      avatar_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_ngo_3',
      name: 'Goonj Foundation India',
      email: 'info@goonj-mock.org',
      password_hash: 'hashed_password_123',
      role: 'NGO',
      college_name: null,
      skills: null,
      contact_info: '+91 80 4115 8899',
      avatar_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'usr_ngo_4',
      name: 'Green Bengaluru Earth Alliance',
      email: 'action@greenbengaluru-mock.org',
      password_hash: 'hashed_password_123',
      role: 'NGO',
      college_name: null,
      skills: null,
      contact_info: '+91 99000 88776',
      avatar_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
    },
  ];

  for (const u of users) {
    await client.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, college_name, skills, contact_info, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [u.id, u.name, u.email, u.password_hash, u.role, u.college_name, u.skills, u.contact_info, u.avatar_url],
    });
  }

  // Insert Campaigns
  const campaigns = [
    {
      id: 'cmp_1',
      ngo_id: 'usr_ngo_1',
      ngo_name: 'Akshaya Patra Foundation',
      title: 'Weekend Mid-Day Meal Preparation & Sorting',
      description: 'Join us this Saturday to help sort, package, and dispatch nutritious hot meals for over 5,000 primary school children across rural South Bengaluru. Volunteers will assist in kitchen hygiene maintenance, tray packing, and dispatch logistics under expert chef supervision.',
      cause_category: 'Hunger Relief',
      location: 'Raja Rajeshwari Nagar Industrial Estate, Bengaluru',
      date: '2026-08-22',
      duration_hours: 4,
      required_volunteers: 25,
      image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      requirements: JSON.stringify(['Comfortable cotton attire', 'Clean apron provided', 'Punctuality at 7:30 AM']),
    },
    {
      id: 'cmp_2',
      ngo_id: 'usr_ngo_2',
      ngo_name: 'Youth For Seva Bengaluru',
      title: 'Tech Shiksha: Python & Web Literacy for Govt School Students',
      description: 'Teach basic computer science, Scratch programming, and Internet safety to 7th and 8th graders at Govt Higher Primary School Jayanagar. We provide all lesson kits and slideshows — engineering students with basic coding knowledge are highly encouraged!',
      cause_category: 'Education & Tech',
      location: 'Jayanagar 4th T Block, Bengaluru',
      date: '2026-08-23',
      duration_hours: 5,
      required_volunteers: 15,
      image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      requirements: JSON.stringify(['Basic programming knowledge', 'Patience & enthusiasm for teaching kids', 'College ID card']),
    },
    {
      id: 'cmp_3',
      ngo_id: 'usr_ngo_4',
      ngo_name: 'Green Bengaluru Earth Alliance',
      title: 'Urban Lake Cleanup & Miyawaki Native Forest Planting Drive',
      description: 'Help restore the ecosystem surrounding Kengeri Lake! Volunteers will help clear plastic waste, dig sapling pits, and plant 250 native tree saplings (Neem, Honge, Peepal) using the Miyawaki high-density afforestation method.',
      cause_category: 'Environment',
      location: 'Kengeri Satellite Town Lake Park, Bengaluru',
      date: '2026-08-30',
      duration_hours: 3,
      required_volunteers: 40,
      image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      requirements: JSON.stringify(['Water bottle', 'Sun cap & garden gloves if available', 'Sturdy shoes']),
    },
    {
      id: 'cmp_4',
      ngo_id: 'usr_ngo_3',
      ngo_name: 'Goonj Foundation India',
      title: 'Cloth & School Kit Assembly Drive for Flood Relief',
      description: 'Sort gently-used clothing, organize school stationery kits, and bundle winter blankets for distribution to rural government school students affected by recent monsoon flooding in Karnataka districts.',
      cause_category: 'Hunger Relief',
      location: 'Koramangala 1st Block Collection Hub, Bengaluru',
      date: '2026-09-05',
      duration_hours: 4,
      required_volunteers: 20,
      image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      requirements: JSON.stringify(['Attention to detail', 'Willingness to handle fabric bundling']),
    },
    {
      id: 'cmp_5',
      ngo_id: 'usr_ngo_2',
      ngo_name: 'Youth For Seva Bengaluru',
      title: 'Weekend Elder Companion & Smartphone Digital Literacy',
      description: 'Spend a heartwarming Sunday morning with senior citizens at Harmony Senior Living. Volunteers will guide elders on how to use WhatsApp video calls, online bill payments, and play interactive memory games.',
      cause_category: 'Elderly Care',
      location: 'Banashankari 3rd Stage, Bengaluru',
      date: '2026-09-06',
      duration_hours: 3,
      required_volunteers: 12,
      image_url: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e292c7?auto=format&fit=crop&w=1200&q=80',
      requirements: JSON.stringify(['Fluency in Kannada, Hindi, or English', 'Kind and patient demeanor']),
    },
    {
      id: 'cmp_6',
      ngo_id: 'usr_ngo_1',
      ngo_name: 'Akshaya Patra Foundation',
      title: 'Mega Blood Donation Camp & Health Awareness Volunteer Support',
      description: 'Assist doctors and donors at a campus-wide blood donation drive organized outside RNSIT campus metro station. Help manage donor registration desks, distribute energy drinks, and coordinate queue management.',
      cause_category: 'Blood & Health',
      location: 'RR Nagar Metro Station Plaza, Bengaluru',
      date: '2026-09-12',
      duration_hours: 6,
      required_volunteers: 30,
      image_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
      requirements: JSON.stringify(['Active student volunteer badge', 'Good communication skills']),
    },
  ];

  for (const c of campaigns) {
    await client.execute({
      sql: `INSERT INTO campaigns (id, ngo_id, ngo_name, title, description, cause_category, location, date, duration_hours, required_volunteers, image_url, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [c.id, c.ngo_id, c.ngo_name, c.title, c.description, c.cause_category, c.location, c.date, c.duration_hours, c.required_volunteers, c.image_url, c.requirements],
    });
  }

  // Insert Registrations
  const registrations = [
    { id: 'reg_1', student_id: 'usr_stu_1', campaign_id: 'cmp_1', status: 'CONFIRMED', registered_at: '2026-08-10 09:30:00' },
    { id: 'reg_2', student_id: 'usr_stu_1', campaign_id: 'cmp_2', status: 'REGISTERED', registered_at: '2026-08-10 10:15:00' },
    { id: 'reg_3', student_id: 'usr_stu_1', campaign_id: 'cmp_3', status: 'ATTENDED', registered_at: '2026-08-01 11:00:00' },
    { id: 'reg_4', student_id: 'usr_stu_2', campaign_id: 'cmp_1', status: 'REGISTERED', registered_at: '2026-08-09 14:20:00' },
    { id: 'reg_5', student_id: 'usr_stu_2', campaign_id: 'cmp_4', status: 'CONFIRMED', registered_at: '2026-08-08 16:45:00' },
    { id: 'reg_6', student_id: 'usr_stu_3', campaign_id: 'cmp_3', status: 'CONFIRMED', registered_at: '2026-08-07 10:00:00' },
  ];

  for (const r of registrations) {
    await client.execute({
      sql: `INSERT INTO registrations (id, student_id, campaign_id, status, registered_at) VALUES (?, ?, ?, ?, ?)`,
      args: [r.id, r.student_id, r.campaign_id, r.status, r.registered_at],
    });
  }

  // Insert Bookmarks
  const bookmarks = [
    { id: 'bm_1', student_id: 'usr_stu_1', campaign_id: 'cmp_4' },
    { id: 'bm_2', student_id: 'usr_stu_1', campaign_id: 'cmp_5' },
    { id: 'bm_3', student_id: 'usr_stu_2', campaign_id: 'cmp_2' },
  ];

  for (const b of bookmarks) {
    await client.execute({
      sql: `INSERT INTO bookmarks (id, student_id, campaign_id) VALUES (?, ?, ?)`,
      args: [b.id, b.student_id, b.campaign_id],
    });
  }

  console.log('✅ Database seeded successfully with @libsql/client! 4 Users, 4 NGOs, 6 Campaigns, 6 Registrations, 3 Bookmarks.');
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
});
