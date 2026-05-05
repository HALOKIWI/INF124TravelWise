import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedTrips, seedNotifications, seedRecommendations } from '../data/seedData.js'

const TripsContext = createContext(null)
const STORAGE_KEY = 'wanderly.trips.v2'
const NOTIF_KEY = 'wanderly.notifs.v2'

const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return seedTrips
  })

  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem(NOTIF_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return seedNotifications
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  }, [trips])

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications))
  }, [notifications])

  const getTrip = useCallback((id) => trips.find((t) => t.id === id), [trips])

  const addTrip = useCallback((trip) => {
    const id = trip.id || uid('trip')
    const newTrip = {
      id,
      name: trip.name || 'Untitled Trip',
      location: trip.location || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      cover:
        trip.cover ||
        'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1600&q=80',
      color: trip.color || 'from-brand-400 to-brand-700',
      budget: { total: 1000, spent: 0 },
      members: trip.members || [],
      accommodations: [],
      events: [],
      expenses: [],
      debts: [],
      activity: [],
      ...trip,
    }
    setTrips((all) => [newTrip, ...all])
    return newTrip
  }, [])

  const updateTrip = useCallback((id, patch) => {
    setTrips((all) =>
      all.map((t) => (t.id === id ? (typeof patch === 'function' ? patch(t) : { ...t, ...patch }) : t)),
    )
  }, [])

  const removeTrip = useCallback((id) => {
    setTrips((all) => all.filter((t) => t.id !== id))
  }, [])

  // ---- Sub-resource helpers ----------------------------------------------
  const addEvent = useCallback(
    (tripId, event) => {
      const e = { id: uid('e'), color: 'bg-brand-200 text-ink-900', ...event }
      updateTrip(tripId, (t) => ({
        ...t,
        events: [...t.events, e],
        activity: [
          {
            id: uid('act'),
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            user: 'You',
            text: `Added ${e.title} to schedule`,
          },
          ...t.activity,
        ],
      }))
    },
    [updateTrip],
  )

  const updateEvent = useCallback(
    (tripId, eventId, patch) => {
      updateTrip(tripId, (t) => ({
        ...t,
        events: t.events.map((e) => (e.id === eventId ? { ...e, ...patch } : e)),
      }))
    },
    [updateTrip],
  )

  const removeEvent = useCallback(
    (tripId, eventId) => {
      updateTrip(tripId, (t) => ({
        ...t,
        events: t.events.filter((e) => e.id !== eventId),
      }))
    },
    [updateTrip],
  )

  const addExpense = useCallback(
    (tripId, expense) => {
      const e = { id: uid('x'), ...expense }
      updateTrip(tripId, (t) => ({
        ...t,
        expenses: [e, ...t.expenses],
        budget: { ...t.budget, spent: (t.budget?.spent || 0) + Number(e.amount || 0) },
        activity: [
          {
            id: uid('act'),
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            user: 'You',
            text: `Added expense ${e.name} ($${e.amount})`,
          },
          ...t.activity,
        ],
      }))
    },
    [updateTrip],
  )

  const updateExpense = useCallback(
    (tripId, expenseId, patch) => {
      updateTrip(tripId, (t) => {
        const old = t.expenses.find((x) => x.id === expenseId)
        const oldAmt = Number(old?.amount || 0)
        const newAmt = Number(patch.amount ?? oldAmt)
        return {
          ...t,
          expenses: t.expenses.map((x) => (x.id === expenseId ? { ...x, ...patch } : x)),
          budget: { ...t.budget, spent: (t.budget?.spent || 0) - oldAmt + newAmt },
        }
      })
    },
    [updateTrip],
  )

  const removeExpense = useCallback(
    (tripId, expenseId) => {
      updateTrip(tripId, (t) => {
        const old = t.expenses.find((x) => x.id === expenseId)
        const amt = Number(old?.amount || 0)
        return {
          ...t,
          expenses: t.expenses.filter((x) => x.id !== expenseId),
          budget: { ...t.budget, spent: Math.max(0, (t.budget?.spent || 0) - amt) },
        }
      })
    },
    [updateTrip],
  )

  const setBudgetTotal = useCallback(
    (tripId, total) => {
      updateTrip(tripId, (t) => ({ ...t, budget: { ...t.budget, total: Number(total) } }))
    },
    [updateTrip],
  )

  const addMember = useCallback(
    (tripId, member) => {
      const m = {
        id: uid('m'),
        avatar:
          member.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name || 'guest')}`,
        ...member,
      }
      updateTrip(tripId, (t) => ({ ...t, members: [...t.members, m] }))
    },
    [updateTrip],
  )

  const removeMember = useCallback(
    (tripId, memberId) => {
      updateTrip(tripId, (t) => ({ ...t, members: t.members.filter((m) => m.id !== memberId) }))
    },
    [updateTrip],
  )

  // ---- Notifications ------------------------------------------------------
  const markNotifRead = useCallback(
    (id) =>
      setNotifications((arr) => arr.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [],
  )
  const markAllNotifsRead = useCallback(
    () => setNotifications((arr) => arr.map((n) => ({ ...n, read: true }))),
    [],
  )

  const value = useMemo(
    () => ({
      trips,
      getTrip,
      addTrip,
      updateTrip,
      removeTrip,
      addEvent,
      updateEvent,
      removeEvent,
      addExpense,
      updateExpense,
      removeExpense,
      setBudgetTotal,
      addMember,
      removeMember,
      recommendations: seedRecommendations,
      notifications,
      markNotifRead,
      markAllNotifsRead,
    }),
    [
      trips,
      getTrip,
      addTrip,
      updateTrip,
      removeTrip,
      addEvent,
      updateEvent,
      removeEvent,
      addExpense,
      updateExpense,
      removeExpense,
      setBudgetTotal,
      addMember,
      removeMember,
      notifications,
      markNotifRead,
      markAllNotifsRead,
    ],
  )

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>
}

export const useTrips = () => useContext(TripsContext)
