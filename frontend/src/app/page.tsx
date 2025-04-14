// 'use client'

// import React, { useState } from 'react'
// import FileUpload from '@/components/FileUpload'
// import TaskSelector from '@/components/TaskSelector'
// import AutomlRunner from '@/components/AutoMLRunner'
// import DownloadModel from '@/components/DownloadModel'

// export default function HomePage() {
//   const [filePath, setFilePath] = useState('')
//   const [task, setTask] = useState('')
//   const [modelFilename, setModelFilename] = useState('')

//   return (
//     <main className="max-w-xl mx-auto px-4 py-10 space-y-8">
//       <h1 className="text-3xl font-bold text-center">AutoML Lite</h1>

//       <section className="p-6 border rounded-2xl shadow bg-white space-y-4">
//         <h2 className="text-xl font-semibold">1️⃣ Upload Dataset</h2>
//         <FileUpload onUploadSuccess={setFilePath} />
//       </section>

//       <section className="p-6 border rounded-2xl shadow bg-white space-y-4">
//         <h2 className="text-xl font-semibold">2️⃣ Select Task</h2>
//         <TaskSelector selectedTask={task} onTaskChange={setTask} />
//       </section>

//       <section className="p-6 border rounded-2xl shadow bg-white space-y-4">
//         <h2 className="text-xl font-semibold">3️⃣ Run AutoML</h2>
//         <AutomlRunner filePath={filePath} task={task} onModelReady={setModelFilename} />
//       </section>

//       {modelFilename && (
//         <section className="p-6 border rounded-2xl shadow bg-white space-y-4">
//           <h2 className="text-xl font-semibold">4️⃣ Download Model</h2>
//           <DownloadModel modelFilename={modelFilename} />
//         </section>
//       )}
//     </main>
//   )
// }

//---------------------------------------------------------

'use client'

import React, { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import TaskSelector from '@/components/TaskSelector'
import AutomlRunner from '@/components/AutoMLRunner'
import DownloadModel from '@/components/DownloadModel'
import { Sparkles, Brain, Zap } from 'lucide-react'
import { ThemeProvider } from "@/components/theme-provider"

export default function HomePage() {
  const [filePath, setFilePath] = useState('')
  const [task, setTask] = useState('')
  const [modelFilename, setModelFilename] = useState('')

  return (
    <>
      <html lang="en" suppressHydrationWarning></html>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="w-12 h-12 text-primary animate-pulse" />
                <h1 className="font-space-grotesk text-5xl font-bold bg-clip-text">
                  AutoML Lite
                </h1>
              </div>
              <p className="font-outfit text-xl text-muted-foreground max-w-2xl mx-auto">
                Train powerful machine learning models with just a few clicks
              </p>
            </div>

            <div className="grid gap-8">
              <section className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-lg"></div>
                <div className="relative p-8 bg-white dark:bg-slate-900 rounded-xl border shadow-lg space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="font-space-grotesk text-2xl font-bold px-4">Upload Dataset</h2>
                  </div>
                  <FileUpload onUploadSuccess={setFilePath} />
                </div>
              </section>

              {filePath && (
                <section className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
                  <div className="relative p-8 bg-white dark:bg-slate-900 rounded-xl border shadow-lg space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Brain className="w-6 h-6 text-purple-500" />
                      </div>
                      <h2 className="font-space-grotesk text-2xl font-bold px-4">Select Task</h2>
                    </div>
                    <TaskSelector selectedTask={task} onTaskChange={setTask} />
                  </div>
                </section>
              )}

              {filePath && task && (
                <section className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-2xl blur-lg"></div>
                  <div className="relative p-8 bg-white dark:bg-slate-900 rounded-xl border shadow-lg space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Zap className="w-6 h-6 text-blue-500" />
                      </div>
                      <h2 className="font-space-grotesk text-2xl font-bold px-4">Train Model</h2>
                    </div>
                    <AutomlRunner filePath={filePath} task={task} onModelReady={setModelFilename} />
                  </div>
                </section>
              )}


              {modelFilename && (
                <section className="relative animate-in fade-in slide-in-from-bottom duration-700">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-primary/20 rounded-2xl blur-lg"></div>
                  <div className="relative p-8 bg-white dark:bg-slate-900 rounded-xl border shadow-lg space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Sparkles className="w-6 h-6 text-green-500" />
                      </div>
                      <h2 className="font-space-grotesk text-2xl font-bold px-4">Download Model</h2>
                    </div>
                    <DownloadModel modelFilename={modelFilename} />
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
        </ThemeProvider>
    </>
  )
}