export const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
]

export const CONCERN_TYPES = [
  // Medical
  { value: 'medical',       label: 'Medical Consultation',       clinic: 'medical' },
  { value: 'first_aid',     label: 'First Aid & Emergency',      clinic: 'medical' },
  { value: 'medicines',     label: 'Medicines & Supplies',       clinic: 'medical' },
  // Dental
  { value: 'dental',        label: 'Dental Services',            clinic: 'dental'  },
  // Mental Health
  { value: 'mental_health', label: 'Mental Health / Counseling', clinic: 'mental'  },
]

export const CONCERN_LABEL = {
  medical:       'Medical Consultation',
  first_aid:     'First Aid & Emergency',
  medicines:     'Medicines & Supplies',
  dental:        'Dental Services',
  mental_health: 'Mental Health',
}

export const CLINIC_CONCERNS = {
  medical: ['medical', 'first_aid', 'medicines'],
  dental:  ['dental'],
  mental:  ['mental_health'],
}

export const STATUS_BADGE_CLASS = {
  pending:   'status-pending',
  approved:  'status-approved',
  rejected:  'status-rejected',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
}

export const STATUS_DOT = {
  pending:   'bg-yellow-400',
  approved:  'bg-green-400',
  completed: 'bg-blue-400',
  rejected:  'bg-red-400',
  cancelled: 'bg-gray-400',
}

export const DEPARTMENTS = [
  'Civil Engineering (BSCE)',
  'Computer Engineering (BSCpE)',
  'Electrical Engineering (BSEE)',
  'Electronics Engineering (BSECE)',
  'Industrial Engineering (BSIE)',
  'Mechanical Engineering (BSME)',
  'Railway Engineering (BSRE)',
]

export const YEAR_LEVELS = [
  '1st Year', '2nd Year', '3rd Year',
  '4th Year', '5th Year', 'Graduate',
]

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']