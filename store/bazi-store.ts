import { create } from 'zustand'

export type CalendarType = 'solar' | 'lunar'
export type Gender = 'male' | 'female'

export interface BaziFormData {
  birthDate: Date | null
  calendarType: CalendarType
  birthHour: string
  gender: Gender
  useTrueSolarTime: boolean
}

interface BaziStore {
  formData: BaziFormData
  setFormData: (data: Partial<BaziFormData>) => void
  resetForm: () => void
}

const initialFormData: BaziFormData = {
  birthDate: null,
  calendarType: 'solar',
  birthHour: '',
  gender: 'male',
  useTrueSolarTime: false,
}

export const useBaziStore = create<BaziStore>((set) => ({
  formData: initialFormData,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set({ formData: initialFormData }),
}))
