// // src/components/TaskSelector.tsx

// 'use client'

// import React from 'react'
// import { Label } from '@/components/ui/label'
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

// interface TaskSelectorProps {
//   selectedTask: string
//   onTaskChange: (task: string) => void
// }

// const TaskSelector: React.FC<TaskSelectorProps> = ({ selectedTask, onTaskChange }) => {
//   return (
//     <div className="space-y-2">
//       <Label>Select Task</Label>
//       <Select value={selectedTask} onValueChange={onTaskChange}>
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Choose task" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="classification">Classification</SelectItem>
//           <SelectItem value="regression">Regression</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }

// export default TaskSelector

//----------------------------------------------

'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { LineChart, BrainCircuit } from 'lucide-react'

interface TaskSelectorProps {
  selectedTask: string
  onTaskChange: (task: string) => void
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ selectedTask, onTaskChange }) => {
  const tasks = [
    {
      value: 'classification',
      label: 'Classification',
      icon: BrainCircuit,
    },
    {
      value: 'regression',
      label: 'Regression',
      icon: LineChart,
    },
  ]

  return (
    <Card className="p-6 max-w-md px-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Machine Learning Task</Label>
          <p className="text-sm text-muted-foreground">
            Choose the type of prediction task for your dataset
          </p>
        </div>

        <Select value={selectedTask} onValueChange={onTaskChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose task" />
          </SelectTrigger>
          <SelectContent>
            {tasks.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value} className="flex items-center">
                <div className="flex items-center gap-3 py-1">
                  <div className="p-1 rounded-md bg-muted">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{label}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  )
}

export default TaskSelector