// Static seed data localized for Okene, Kogi State — the heart of Ebira land.
// Names reflect the Ebira people, with Hausa, Yoruba, Igala, Nupe and Igbo
// representation drawn from across Kogi and neighbouring communities.

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
  title?: string;
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
  hometown?: string;
};

export const DOCTORS: Doctor[] = [
  {
    id: 'prof-avidime-salihu',
    doctorId: 'DR-00101',
    firstName: 'Salihu',
    lastName: 'Avidime',
    title: 'Prof.',
    photoURL: 'https://ui-avatars.com/api/?name=Salihu+Avidime&size=400&background=12266B&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FWACS', 'FMCS', 'PhD'],
    specialization: ['Obstetrics & Gynaecology'],
    specialtyId: 'obstetrics',
    yearsOfExperience: 28,
    consultationFee: 20000,
    telehealthAvailable: true,
    telehealthFee: 15000,
    averageRating: 4.95,
    totalReviews: 412,
    totalPatientsSeen: 8200,
    languages: ['English', 'Ebira', 'Hausa', 'Yoruba'],
    bio: 'Professor of Obstetrics & Gynaecology and Chief Medical Director of Okene Reference Hospital. Fellow of the West African College of Surgeons, with over 28 years advancing safe motherhood across Kogi Central. Leads the high-risk pregnancy unit and the hospital-wide clinical governance board.',
    department: 'Obstetrics & Gynaecology',
    position: 'Chief Medical Director',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    workingHours: { start: '08:00', end: '16:00' },
    isAcceptingPatients: true,
    hometown: 'Okene'
  },
  {
    id: 'dr-omeiza-nuhu',
    doctorId: 'DR-00102',
    firstName: 'Omeiza',
    lastName: 'Nuhu',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Omeiza+Nuhu&size=400&background=991B1B&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FMCS', 'FWACS'],
    specialization: ['Cardiology'],
    specialtyId: 'cardiology',
    yearsOfExperience: 17,
    consultationFee: 18000,
    telehealthAvailable: true,
    telehealthFee: 12000,
    averageRating: 4.9,
    totalReviews: 286,
    totalPatientsSeen: 5400,
    languages: ['English', 'Ebira', 'Hausa'],
    bio: 'Consultant Cardiologist specialising in interventional cardiology, heart failure and hypertension management. Trained in Ahmadu Bello University and fellowship in interventional cardiology at the Nigerian National Cardiothoracic Centre. Champions community screening across Okene, Adavi and Ajaokuta.',
    department: 'Cardiology',
    position: 'Senior Consultant',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true,
    hometown: 'Adavi'
  },
  {
    id: 'dr-ohiare-ozavize',
    doctorId: 'DR-00103',
    firstName: 'Ozavize',
    lastName: 'Ohiare',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Ozavize+Ohiare&size=400&background=0369A1&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FMCPaed'],
    specialization: ['Pediatrics'],
    specialtyId: 'pediatrics',
    yearsOfExperience: 14,
    consultationFee: 12000,
    telehealthAvailable: true,
    telehealthFee: 8000,
    averageRating: 4.97,
    totalReviews: 518,
    totalPatientsSeen: 9800,
    languages: ['English', 'Ebira', 'Hausa', 'Yoruba'],
    bio: 'Consultant Paediatrician passionate about newborn care, childhood immunisation and malnutrition recovery. Leads the Okene Under-5 Wellness Clinic and co-founded the Kogi Paediatric Outreach Network reaching over 40 rural communities.',
    department: 'Pediatrics',
    position: 'Consultant',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'SAT'],
    workingHours: { start: '08:00', end: '16:00' },
    isAcceptingPatients: true,
    hometown: 'Okene'
  },
  {
    id: 'dr-abdulrahman-attah',
    doctorId: 'DR-00104',
    firstName: 'Abdulrahman',
    lastName: 'Attah',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Abdulrahman+Attah&size=400&background=C2410C&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FWACS', 'MSc'],
    specialization: ['Orthopedics'],
    specialtyId: 'orthopedics',
    yearsOfExperience: 20,
    consultationFee: 15000,
    telehealthAvailable: false,
    telehealthFee: 0,
    averageRating: 4.82,
    totalReviews: 234,
    totalPatientsSeen: 4600,
    languages: ['English', 'Igala', 'Hausa'],
    bio: 'Consultant Orthopaedic Surgeon with sub-speciality interest in trauma, joint replacement and paediatric deformities. A familiar name on the Lokoja–Okene corridor for managing road-traffic injuries with outcomes comparable to Lagos tertiary centres.',
    department: 'Orthopedics',
    position: 'Senior Consultant',
    workingDays: ['MON', 'WED', 'FRI'],
    workingHours: { start: '10:00', end: '18:00' },
    isAcceptingPatients: true,
    hometown: 'Idah'
  },
  {
    id: 'dr-habiba-yusuf',
    doctorId: 'DR-00105',
    firstName: 'Habiba',
    lastName: 'Yusuf',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Habiba+Yusuf&size=400&background=6D28D9&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FMCN'],
    specialization: ['Neurology'],
    specialtyId: 'neurology',
    yearsOfExperience: 13,
    consultationFee: 20000,
    telehealthAvailable: true,
    telehealthFee: 14000,
    averageRating: 4.88,
    totalReviews: 189,
    totalPatientsSeen: 3400,
    languages: ['English', 'Hausa', 'Ebira'],
    bio: 'Consultant Neurologist focused on stroke prevention, epilepsy and movement disorders. Co-author of the Kogi Stroke Registry and trained at University College Hospital, Ibadan with a fellowship at King’s College Hospital, London.',
    department: 'Neurology',
    position: 'Consultant',
    workingDays: ['MON', 'TUE', 'THU', 'FRI'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true,
    hometown: 'Kaduna'
  },
  {
    id: 'dr-zainab-ozigi',
    doctorId: 'DR-00106',
    firstName: 'Zainab',
    lastName: 'Ozigi',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Zainab+Ozigi&size=400&background=006E6E&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FWACP'],
    specialization: ['General Medicine', 'Family Medicine'],
    specialtyId: 'general',
    yearsOfExperience: 10,
    consultationFee: 8000,
    telehealthAvailable: true,
    telehealthFee: 5000,
    averageRating: 4.78,
    totalReviews: 612,
    totalPatientsSeen: 12400,
    languages: ['English', 'Ebira', 'Hausa', 'Yoruba', 'Igala'],
    bio: 'Family physician and preventive-care advocate. Runs the hospital’s weekend community clinic in Okene and Eika, and leads the chronic-disease management programme for hypertension and diabetes.',
    department: 'General Medicine',
    position: 'Senior Medical Officer',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    workingHours: { start: '08:00', end: '18:00' },
    isAcceptingPatients: true,
    hometown: 'Okengwe'
  },
  {
    id: 'dr-ibrahim-onimisi',
    doctorId: 'DR-00107',
    firstName: 'Ibrahim',
    lastName: 'Onimisi',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Ibrahim+Onimisi&size=400&background=4338CA&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FMCOphth'],
    specialization: ['Ophthalmology'],
    specialtyId: 'ophthalmology',
    yearsOfExperience: 12,
    consultationFee: 14000,
    telehealthAvailable: true,
    telehealthFee: 9000,
    averageRating: 4.86,
    totalReviews: 221,
    totalPatientsSeen: 3800,
    languages: ['English', 'Ebira', 'Yoruba'],
    bio: 'Consultant Ophthalmologist with expertise in cataract surgery, glaucoma management and paediatric ophthalmology. Leads the annual Okene Sight Restoration Outreach which has restored sight to over 1,200 patients.',
    department: 'Ophthalmology',
    position: 'Consultant',
    workingDays: ['TUE', 'WED', 'THU', 'FRI'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true,
    hometown: 'Eika'
  },
  {
    id: 'dr-chioma-adejoh',
    doctorId: 'DR-00108',
    firstName: 'Chioma',
    lastName: 'Adejoh',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Chioma+Adejoh&size=400&background=047857&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'MPH', 'FMCFM'],
    specialization: ['Dermatology'],
    specialtyId: 'dermatology',
    yearsOfExperience: 9,
    consultationFee: 13000,
    telehealthAvailable: true,
    telehealthFee: 9000,
    averageRating: 4.79,
    totalReviews: 174,
    totalPatientsSeen: 2900,
    languages: ['English', 'Igbo', 'Ebira'],
    bio: 'Consultant Dermatologist specialising in skin of colour, eczema, vitiligo and cosmetic dermatology. Combines traditional African skin-care wisdom with modern evidence-based treatments.',
    department: 'Dermatology',
    position: 'Consultant',
    workingDays: ['MON', 'WED', 'FRI', 'SAT'],
    workingHours: { start: '10:00', end: '18:00' },
    isAcceptingPatients: true,
    hometown: 'Ajaokuta'
  },
  {
    id: 'dr-musa-ohize',
    doctorId: 'DR-00109',
    firstName: 'Musa',
    lastName: 'Ohize',
    title: 'Dr.',
    photoURL: 'https://ui-avatars.com/api/?name=Musa+Ohize&size=400&background=A21CAF&color=ffffff&bold=true&format=png',
    qualification: ['MBBS', 'FWACS'],
    specialization: ['ENT'],
    specialtyId: 'ent',
    yearsOfExperience: 15,
    consultationFee: 14000,
    telehealthAvailable: true,
    telehealthFee: 9000,
    averageRating: 4.84,
    totalReviews: 198,
    totalPatientsSeen: 3600,
    languages: ['English', 'Ebira', 'Hausa'],
    bio: 'Consultant ENT surgeon focused on paediatric hearing care, sinus disease and head-and-neck surgery. Known throughout Okene and Ihima for patient-first consultations and clear, jargon-free explanations.',
    department: 'ENT',
    position: 'Consultant',
    workingDays: ['MON', 'TUE', 'THU', 'FRI'],
    workingHours: { start: '09:00', end: '17:00' },
    isAcceptingPatients: true,
    hometown: 'Ihima'
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
    const seed = (h * 31 + m) % 10;
    slots.push({ time: timeStr, available: seed > 2 });
    mins += durationMin;
  }
  return slots;
}
