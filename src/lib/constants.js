export const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
]

export const CONCERN_TYPES = [
  { value: 'medical',       label: 'Medical Consultation' },
  { value: 'dental',        label: 'Dental' },
  { value: 'mental_health', label: 'Mental Health / Counseling' },
  { value: 'other',         label: 'Other' },
]

export const CONCERN_LABEL = {
  medical:       'Medical',
  dental:        'Dental',
  mental_health: 'Mental Health',
  other:         'Other',
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
  'CCIS', 'CAFA', 'CAL', 'CBA', 'CE', 'CET',
  'CHK', 'CLAC', 'COC', 'CS', 'Graduate School',
  'Admin Office', 'Other',
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