import { Component, computed, input, output, signal, OnInit } from '@angular/core'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  isSameDay,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { Database } from '../../../types/database.types'

interface CalendarDayCell {
  date: Date
  dayNumber: string
  isCurrentMonth: boolean
  isPast: boolean
  isToday: boolean
  reservations: Database['public']['Views']['view_reservation']['Row'][]
}

@Component({
  selector: 'app-calendar-grid',
  imports: [],
  templateUrl: './calendar-grid.html',
  styleUrl: './calendar-grid.scss',
})
export class CalendarGrid implements OnInit {
  reservations = input<Database['public']['Views']['view_reservation']['Row'][]>([])
  dayClicked = output<Date>()

  clickReservation(reservation: Database['public']['Views']['view_reservation']['Row']) {
    this.reservationClicked.emit(reservation)
  }

  role = input<'moniteur' | 'eleve'>('moniteur')
  reservationClicked = output<Database['public']['Views']['view_reservation']['Row']>()

  oldestMonthDate: Date = new Date()
  newestMonthDate: Date = new Date()

  displayedMonthsDates = signal<Date[]>([])
  monthsList = computed(() => {
    return this.displayedMonthsDates().map((monthDate) => this.generateMonth(monthDate))
  })

  reservationsByDay = computed(() => {
    const map = new Map<string, any[]>()

    this.reservations().forEach((reservation) => {
      if (!reservation.date_creneau) return
      const liste = map.get(reservation.date_creneau) ?? []
      liste.push(reservation)
      map.set(reservation.date_creneau, liste)
    })
    return map
  })

  ngOnInit() {
    const currentMonth = new Date()

    this.oldestMonthDate = subMonths(currentMonth, 1)
    this.newestMonthDate = addMonths(currentMonth, 1)

    this.displayedMonthsDates.set([this.oldestMonthDate, currentMonth, this.newestMonthDate])
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement

    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
      this.loadNextMonth()
    }

    if (element.scrollTop === 0) {
      this.loadPreviousMonth()
      element.scrollTop = 1
    }
  }

  loadNextMonth() {
    this.newestMonthDate = addMonths(this.newestMonthDate, 1)
    this.displayedMonthsDates.update((dates) => [...dates, this.newestMonthDate])
  }

  loadPreviousMonth() {
    this.oldestMonthDate = subMonths(this.oldestMonthDate, 1)
    this.displayedMonthsDates.update((dates) => [this.oldestMonthDate, ...dates])
  }

  generateMonth(dateDuMois: Date) {
    const monthStart = startOfMonth(dateDuMois)
    const monthEnd = endOfMonth(dateDuMois)

    const firstMonday = startOfWeek(monthStart, { weekStartsOn: 1 })
    const lastSunday = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const allGridDays = eachDayOfInterval({
      start: firstMonday,
      end: lastSunday,
    })

    const today = startOfDay(new Date())

    const formattedDays: CalendarDayCell[] = allGridDays.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      return {
        date: date,
        dayNumber: format(date, 'd'),
        isCurrentMonth: isSameMonth(date, dateDuMois),
        isPast: isBefore(startOfDay(date), today),
        isToday: isSameDay(date, today),
        reservations: this.reservationsByDay().get(dateStr) || [],
      }
    })

    return {
      monthName: format(dateDuMois, 'MMMM yyyy', { locale: fr }),
      days: formattedDays,
    }
  }

  openModal(selectedDate: Date) {
    this.dayClicked.emit(selectedDate)
  }
}
