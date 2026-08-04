export const resourceTableRows = [
  { id: 'R-101', title: '5-Minute Grounding Exercise', category: 'Anxiety', format: 'Guide', rating: 4.8, status: 'Published' },
  { id: 'R-102', title: 'Better Sleep, Better You', category: 'Sleep', format: 'Article', rating: 4.7, status: 'Published' },
  { id: 'R-103', title: 'Talking About Big Feelings', category: 'Family', format: 'Guide', rating: 4.9, status: 'Published' },
  { id: 'R-104', title: 'Focus When It Matters', category: 'Work & Study', format: 'Checklist', rating: 4.6, status: 'Published' },
  { id: 'R-105', title: 'You’re Not Alone', category: 'Loneliness', format: 'Article', rating: 4.8, status: 'Published' },
  { id: 'R-106', title: 'Daily Self-Care Checklist', category: 'Wellbeing', format: 'Checklist', rating: 4.7, status: 'Published' },
  { id: 'R-107', title: 'One-Minute Breathing Pause', category: 'Anxiety', format: 'Exercise', rating: 4.6, status: 'Published' },
  { id: 'R-108', title: 'Supporting Someone Safely', category: 'Family', format: 'Guide', rating: 4.9, status: 'Published' },
  { id: 'R-109', title: 'Preparing for Your First Appointment', category: 'Wellbeing', format: 'Guide', rating: 4.5, status: 'Review' },
  { id: 'R-110', title: 'Managing Study Pressure', category: 'Work & Study', format: 'Article', rating: 4.4, status: 'Review' },
  { id: 'R-111', title: 'Rebuilding a Sleep Routine', category: 'Sleep', format: 'Checklist', rating: 4.6, status: 'Draft' },
  { id: 'R-112', title: 'Finding Local Connection', category: 'Loneliness', format: 'Guide', rating: 4.5, status: 'Draft' },
]

export const eventTableRows = [
  { id: 'E-201', event: 'Understanding workplace anxiety', type: 'Online workshop', date: '2026-08-24', places: 60, availability: 'Open' },
  { id: 'E-202', event: 'Supporting a teenager with depression', type: 'Family session', date: '2026-08-29', places: 30, availability: 'Open' },
  { id: 'E-203', event: 'Connection after moving somewhere new', type: 'Community meetup', date: '2026-09-03', places: 24, availability: 'Open' },
  { id: 'E-204', event: 'Sleep and everyday wellbeing', type: 'Online workshop', date: '2026-09-08', places: 80, availability: 'Open' },
  { id: 'E-205', event: 'Starting supportive conversations', type: 'Family session', date: '2026-09-12', places: 36, availability: 'Open' },
  { id: 'E-206', event: 'Mindful walk by the river', type: 'Community meetup', date: '2026-09-18', places: 18, availability: 'Almost full' },
  { id: 'E-207', event: 'Managing assessment pressure', type: 'Student workshop', date: '2026-09-23', places: 50, availability: 'Open' },
  { id: 'E-208', event: 'Mental health first response', type: 'Training', date: '2026-09-28', places: 20, availability: 'Almost full' },
  { id: 'E-209', event: 'Creative journalling circle', type: 'Community meetup', date: '2026-10-02', places: 16, availability: 'Waitlist' },
  { id: 'E-210', event: 'Building healthy work boundaries', type: 'Online workshop', date: '2026-10-07', places: 70, availability: 'Open' },
  { id: 'E-211', event: 'Carers coffee and connection', type: 'Family session', date: '2026-10-11', places: 22, availability: 'Open' },
  { id: 'E-212', event: 'Calm breathing practice', type: 'Online workshop', date: '2026-10-16', places: 100, availability: 'Open' },
]

export const resourceColumns = [
  { key: 'id', label: 'Resource ID' },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'format', label: 'Format' },
  { key: 'rating', label: 'Rating' },
  { key: 'status', label: 'Status' },
]

export const eventColumns = [
  { key: 'id', label: 'Event ID' },
  { key: 'event', label: 'Event' },
  { key: 'type', label: 'Type' },
  { key: 'date', label: 'Date' },
  { key: 'places', label: 'Places' },
  { key: 'availability', label: 'Availability' },
]
