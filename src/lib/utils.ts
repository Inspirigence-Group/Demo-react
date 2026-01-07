import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy')
}

export function formatDateTime(date: Date): string {
  return format(date, 'dd MMM yyyy à HH:mm')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-400'
  if (score >= 70) return 'text-yellow-400'
  if (score >= 50) return 'text-orange-400'
  return 'text-red-400'
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-green-500/20'
  if (score >= 70) return 'bg-yellow-500/20'
  if (score >= 50) return 'bg-orange-500/20'
  return 'bg-red-500/20'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-blue-500/20 text-blue-400'
    case 'contacted':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'visiting':
      return 'bg-purple-500/20 text-purple-400'
    case 'negotiating':
      return 'bg-orange-500/20 text-orange-400'
    case 'closed':
      return 'bg-green-500/20 text-green-400'
    case 'available':
      return 'bg-green-500/20 text-green-400'
    case 'sold':
      return 'bg-red-500/20 text-red-400'
    case 'reserved':
      return 'bg-yellow-500/20 text-yellow-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

// French locale for date-fns
const fr = {
  code: 'fr',
  formatDistance: (token: string, count: number) => {
    const units: { [key: string]: { one: string; other: string } } = {
      xSeconds: { one: 'une seconde', other: '# secondes' },
      xMinutes: { one: 'une minute', other: '# minutes' },
      xHours: { one: 'une heure', other: '# heures' },
      xDays: { one: 'un jour', other: '# jours' },
      xWeeks: { one: 'une semaine', other: '# semaines' },
      xMonths: { one: 'un mois', other: '# mois' },
      xYears: { one: 'un an', other: '# ans' },
    }
    const unit = units[token]
    if (unit) {
      return count === 1 ? unit.one : unit.other.replace('#', count.toString())
    }
    return ''
  },
  formatRelative: (token: string) => {
    const relative: { [key: string]: string } = {
      lastWeek: 'dernière semaine',
      yesterday: 'hier',
      today: "aujourd'hui",
      tomorrow: 'demain',
      nextWeek: 'semaine prochaine',
      inOtherPeriod: 'période',
    }
    return relative[token] || ''
  },
  localize: {
    ordinalNumber: (n: number) => n.toString(),
    era: (n: number) => (n === 1 ? 'ap. J.-C.' : 'av. J.-C.'),
    quarter: (n: number) => `T${n}`,
    month: (n: number) => {
      const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ]
      return months[n - 1]
    },
    day: (n: number) => {
      const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
      return days[n]
    },
    dayPeriod: (n: number) => {
      const periods = ['matin', 'après-midi', 'soir', 'nuit']
      return periods[n] || ''
    },
  },
  match: {
    ordinalNumber: () => false,
    era: () => /^(Anno Domini|before Christ|after Christ|v\. Chr\.|n\. Chr\.|v\. Chr\. n\. Chr\.)$/i,
    quarter: () => /^[1-4][Tt]$/i,
    month: () => /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$/i,
    day: () => /^(sun|mon|tue|wed|thu|fri|sat)$/i,
    dayPeriod: () => /^(AM|PM|am|pm|a\.m\.|p\.m\.)/i,
  },
}
