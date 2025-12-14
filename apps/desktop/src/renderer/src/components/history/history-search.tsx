import { Search } from 'lucide-react'
import { Input } from '../ui'

interface HistorySearchProps {
  value: string
  onChange: (value: string) => void
}

export const HistorySearch = ({ value, onChange }: HistorySearchProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <Input
      icon={<Search className="w-4 h-4" />}
      placeholder="Search transcriptions..."
      value={value}
      onChange={handleChange}
    />
  )
}

