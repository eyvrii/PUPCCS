-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Appointments table
create table if not exists appointments (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  id_number text not null,
  email text not null,
  contact_number text not null,
  type text not null check (type in ('student', 'faculty', 'staff')),
  department text not null,
  year_level text,
  preferred_date date not null,
  preferred_time text not null,
  concern_type text not null,
  concern_description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'completed', 'rejected', 'cancelled')),
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_appointments_updated_at
  before update on appointments
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table appointments enable row level security;

-- Public can insert (book appointments)
create policy "Anyone can book appointments"
  on appointments for insert
  with check (true);

-- Only authenticated admins can read/update
create policy "Admins can read appointments"
  on appointments for select
  using (auth.role() = 'authenticated');

create policy "Admins can update appointments"
  on appointments for update
  using (auth.role() = 'authenticated');

-- Sample data
insert into appointments
  (full_name, id_number, email, contact_number, type, department, year_level,
   preferred_date, preferred_time, concern_type, concern_description, status)
values
  ('Maria Santos', '2021-00001-MN-0', 'msantos@pup.edu.ph', '09171234567',
   'student', 'CCIS', '3rd Year', '2025-06-10', '09:00 AM', 'medical',
   'Lagnat at ubo', 'completed'),

  ('Jose Reyes', '2020-00042-MN-0', 'jreyes@pup.edu.ph', '09281234567',
   'student', 'CAFA', '4th Year', '2025-06-11', '10:00 AM', 'dental',
   'Masakit ang ngipin', 'approved'),

  ('Ana Dela Cruz', '2022-00015-MN-0', 'adelacruz@pup.edu.ph', '09391234567',
   'student', 'CE', '2nd Year', '2025-06-12', '01:00 PM', 'mental_health',
   'Anxiety at stress', 'pending'),

  ('Prof. Roberto Lim', 'FAC-2019-0023', 'rlim@pup.edu.ph', '09451234567',
   'faculty', 'CCIS', null, '2025-06-13', '02:00 PM', 'medical',
   'Blood pressure check', 'approved'),

  ('Maria Santos', '2021-00001-MN-0', 'msantos@pup.edu.ph', '09171234567',
   'student', 'CCIS', '3rd Year', '2025-05-20', '08:00 AM', 'medical',
   'Follow-up checkup', 'completed');
