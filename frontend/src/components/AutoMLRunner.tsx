// // src/components/AutomlRunner.tsx

// 'use client'

// import React, { useState } from 'react'
// import axios from 'axios'
// import { Button } from '@/components/ui/button'

// interface AutomlRunnerProps {
//     filePath: string
//     task: string
//     onModelReady: (filename: string) => void
// }

// const AutomlRunner: React.FC<AutomlRunnerProps> = ({ filePath, task, onModelReady }) => {
//     const [loading, setLoading] = useState(false)
//     const [modelName, setModelName] = useState('')
//     const [score, setScore] = useState<number | null>(null)
//     const [error, setError] = useState('')

//     const runAutoml = async () => {
//         setLoading(true)
//         setError('')
//         try {
//             const res = await axios.post('http://localhost:5000/run_automl', {
//                 file_path: filePath,
//                 task: task
//             })
//             setModelName(res.data.best_model)
//             setScore(res.data.score)
//             onModelReady(res.data.model_filename)
//         } catch (err) {
//             setError('Failed to run AutoML')
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="space-y-4">
//             <Button onClick={runAutoml} disabled={loading || !filePath || !task}>
//                 {loading ? 'Running AutoML...' : 'Run AutoML'}
//             </Button>
//             {modelName && (
//                 <p className="text-sm text-green-600">
//                     ✅ Best Model: <strong>{modelName}</strong> <br />
//                     🔢 Score: <strong>{score}</strong>
//                 </p>
//             )}
//             {error && <p className="text-sm text-red-500">{error}</p>}
//         </div>
//     )
// }

// export default AutomlRunner

//---------------------------------------------------------------

// src/components/AutomlRunner.tsx

'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'


interface AutomlRunnerProps {
    filePath: string
    task: string
    onModelReady: (filename: string) => void
}

const AutomlRunner: React.FC<AutomlRunnerProps> = ({ filePath, task, onModelReady }) => {
    const [loading, setLoading] = useState(false)
    const [modelName, setModelName] = useState('')
    const [score, setScore] = useState<number | null>(null)
    const [error, setError] = useState('')

    const runAutoml = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await axios.post('https://automl-lite.onrender.com/run_automl', {
                file_path: filePath,
                task: task
            })
            setModelName(res.data.best_model)
            setScore(res.data.score)
            onModelReady(res.data.model_filename)
        } catch (err) {
            setError('Failed to run AutoML')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 px-4">
            <Button onClick={runAutoml} disabled={loading || !filePath || !task}>
                {loading ? 'Running AutoML...' : 'Run AutoML'}
            </Button>
            {loading && (
                <div className="w-full">
                    <div className="mb-2 text-sm text-gray-600">Running AutoML...</div>
                </div>
            )}
            {modelName && (
                <p className="text-sm text-green-600">
                    ✅ Best Model: <strong>{modelName}</strong> <br />
                    🔢 Score: <strong>{score}</strong>
                </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
    
}

export default AutomlRunner

