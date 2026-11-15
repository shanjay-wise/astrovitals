import { createContext, useContext, useState } from 'react'
import { crewMembers } from '../data/crewData'

const CrewContext = createContext()

export function CrewProvider({ children }) {
  const [selectedCrew, setSelectedCrew] = useState(crewMembers[0].id)
  const currentMember = crewMembers.find(m => m.id === selectedCrew) || crewMembers[0]

  return (
    <CrewContext.Provider value={{ selectedCrew, setSelectedCrew, currentMember, crewMembers }}>
      {children}
    </CrewContext.Provider>
  )
}

export const useCrew = () => useContext(CrewContext)
