// Static seed data used before Firebase content is populated.
// Provides a realistic premium demo experience.

export type Specialty = {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
};

export const SPECIALTIES: Specialty[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: '🫀',
    description: 'Heart and vascular care',
    gradient: 'from-rose-500/20 to-red-500/10'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: '🧠',
    description: 'Brain and nervous system',
    gradient: 'from-violet-500/20 to-purple-500/10'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    icon: '🦴',
    description: 'Bones, joints, muscles',
    gradient: 'from-amber-500/20 to-orange-500/10'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: '👶',
    description: 'Children & adolescents',
    gradient: 'from-sky-500/20 to-cyan-500/10'
  },
  {
    id: 'obstetrics',
    name: 'Obstetrics & Gynaecology',
    icon: '🤰',
    description: 'Women & maternal health',
    gradient: 'from-pink-500/20 to-rose-500/10'
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    icon: '👁️',
    description: 'Eye health and vision',
    gradient: 'from-indigo-500/20 to-blue-500/10'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: '🩺',
    description: 'Skin, hair and nails',
    gradient: 'from-emerald-500/20 to-teal-500/10'
  },
  {
    id: 'ent',
    name: 'ENT',
    icon: '👂',
    description: 'Ear, nose and throat',
    gradient: 'from-fuchsia-500/20 to-purple-500/10'
  },
  {
    id: 'general',
    name: 'General Medicine',
    icon: '⚕️',
    description: 'Primary care',
    gradient: 'from-teal-500/20 to-cyan-500/10'
  }
];

export type Doctor = {
  id: string;
  doctorId: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  qualification: string[];
  specialization: string[];
  specialtyId: string;
  yearsOfExperience: number;
  consultationFee: number;
  telehealthAvailable: boolean;
  telehealthFee: number;
  averageRating: number;
  totalReviews: number;
  totalPatientsSeen: number;
  languages: string[];
  bio: string;
  department: string;
  position: string;
  workingDays: string[];
  workingHours: { start: string; end: string };
  isAcceptingPatients: boolean;
};

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-ibrahim-musa',
    doctorId: 'DR-00101',
    firstName: 'Ibrahim',
    lastName: 'Musa',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    qualification: ['MBBS', 'FMCS', 'FWACS'],
    specialization: ['Cardiology'],
    specialtyId: 'cardiology',
    yearsOfExperience: 15,
    consultationFee: 15000,
    telehealthAvailable: true,
    telehealthFee: 10000,
    averageRating: 4.9,
    totalReviews: 218,
    totalPatientsSeen: 4200,
    languages: ['English', 'Hausa', 'Yoruba'],
    bio: 'Consultant Cardiologist with 15 years of experience in interventional cardiology, cardiac imaging and heart failure management. Fellow of the West African College of Surgeons.',
    department: 'Cardiology',
    position: 'Consultant',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true
  },
  {
    id: 'dr-amina-hassan',
    doctorId: 'DR-00102',
    firstName: 'Amina',
    lastName: 'Hassan',
    photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
    qualification: ['MBBS', 'FMCPaed'],
    specialization: ['Pediatrics'],
    specialtyId: 'pediatrics',
    yearsOfExperience: 12,
    consultationFee: 10000,
    telehealthAvailable: true,
    telehealthFee: 7500,
    averageRating: 4.95,
    totalReviews: 342,
    totalPatientsSeen: 6800,
    languages: ['English', 'Hausa'],
    bio: 'Senior paediatrician specialising in neonatology and childhood immunisation. Mother of two, passionate about child-friendly care.',
    department: 'Pediatrics',
    position: 'Consultant',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'SAT'],
    workingHours: { start: '08:00', end: '16:00' },
    isAcceptingPatients: true
  },
  {
    id: 'dr-tunde-bello',
    doctorId: 'DR-00103',
    firstName: 'Tunde',
    lastName: 'Bello',
    photoURL: 'https://randomuser.me/api/portraits/men/41.jpg',
    qualification: ['MBBS', 'FWACS', 'MSc'],
    specialization: ['Orthopedics'],
    specialtyId: 'orthopedics',
    yearsOfExperience: 18,
    consultationFee: 12000,
    telehealthAvailable: false,
    telehealthFee: 0,
    averageRating: 4.7,
    totalReviews: 175,
    totalPatientsSeen: 3900,
    languages: ['English', 'Yoruba'],
    bio: 'Orthopaedic surgeon with special interest in joint replacement, sports injuries and paediatric orthopaedics.',
    department: 'Orthopedics',
    position: 'Senior Consultant',
    workingDays: ['MON', 'WED', 'FRI'],
    workingHours: { start: '10:00', end: '18:00' },
    isAcceptingPatients: true
  },
  {
    id: 'dr-zainab-aliyu',
    doctorId: 'DR-00104',
    firstName: 'Zainab',
    lastName: 'Aliyu',
    photoURL: 'https://randomuser.me/api/portraits/women/68.jpg',
    qualification: ['MBBS', 'FMCOG'],
    specialization: ['Obstetrics & Gynaecology'],
    specialtyId: 'obstetrics',
    yearsOfExperience: 14,
    consultationFee: 13000,
    telehealthAvailable: true,
    telehealthFee: 9000,
    averageRating: 4.85,
    totalReviews: 260,
    totalPatientsSeen: 5100,
    languages: ['English', 'Hausa', 'Ebira'],
    bio: 'Obstetrician-gynaecologist dedicated to safe motherhood and reproductive health. Leads the high-risk pregnancy clinic.',
    department: 'Obstetrics & Gynaecology',
    position: 'Consultant',
    workingDays: ['TUE', 'WED', 'THU', 'FRI', 'SAT'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true
  },
  {
    id: 'dr-chinedu-okoro',
    doctorId: 'DR-00105',
    firstName: 'Chinedu',
    lastName: 'Okoro',
    photoURL: 'https://randomuser.me/api/portraits/men/52.jpg',
    qualification: ['MBBS', 'FMCN'],
    specialization: ['Neurology'],
    specialtyId: 'neurology',
    yearsOfExperience: 11,
    consultationFee: 18000,
    telehealthAvailable: true,
    telehealthFee: 12000,
    averageRating: 4.8,
    totalReviews: 144,
    totalPatientsSeen: 2800,
    languages: ['English', 'Igbo'],
    bio: 'Neurologist with expertise in stroke, epilepsy and movement disorders. Published author with 20+ peer-reviewed publications.',
    department: 'Neurology',
    position: 'Consultant',
    workingDays: ['MON', 'TUE', 'THU', 'FRI'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true
  },
  {
    id: 'dr-fatima-sani',
    doctorId: 'DR-00106',
    firstName: 'Fatima',
    lastName: 'Sani',
    photoURL: 'https://randomuser.me/api/portraits/women/22.jpg',
    qualification: ['MBBS', 'FWACP'],
    specialization: ['General Medicine'],
    specialtyId: 'general',
    yearsOfExperience: 8,
    consultationFee: 7000,
    telehealthAvailable: true,
    telehealthFee: 5000,
    averageRating: 4.75,
    totalReviews: 412,
    totalPatientsSeen: 9200,
    languages: ['English', 'Hausa', 'Yoruba', 'Ebira'],
    bio: 'Family physician focused on preventive care, chronic disease management and wellness.',
    department: 'General Medicine',
    position: 'Senior Medical Officer',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    workingHours: { start: '08:00', end: '18:00' },
    isAcceptingPatients: true
  }
];

export function generateTimeSlots(
  start = '09:00',
  end = '17:00',
  durationMin = 30
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let mins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  while (mins + durationMin <= endMins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    // Deterministic availability pattern (~70% available)
    const seed = (h * 31 + m) % 10;
    slots.push({ time: timeStr, available: seed > 2 });
    mins += durationMin;
  }
  return slots;
}
