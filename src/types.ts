export type AppView = 'home' | 'exam'

export interface CivicsQuestion {
  id: number
  section: string
  question: string
  acceptableAnswers: string[]
  /** 65/20 special consideration (asterisk) questions */
  is6520: boolean
}
