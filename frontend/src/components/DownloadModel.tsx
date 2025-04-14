// // src/components/DownloadModel.tsx

// 'use client'

// import React from 'react'
// import { Button } from '@/components/ui/button'

// interface DownloadModelProps {
//     modelFilename: string
// }

// const DownloadModel: React.FC<DownloadModelProps> = ({ modelFilename }) => {
//     const handleDownload = () => {
//         const url = `http://localhost:5000/download/${modelFilename}`
//         window.open(url, '_blank')
//     }

//     return (
//         <div>
//             <Button onClick={handleDownload} disabled={!modelFilename}>
//                 Download Trained Model
//             </Button>
//         </div>
//     )
// }

// export default DownloadModel

//----------------------------------------------------------

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DownloadModelProps {
    modelFilename: string
}

const DownloadModel: React.FC<DownloadModelProps> = ({ modelFilename }) => {
    const handleDownload = () => {
        const url = `https://automl-lite.onrender.com/download/${modelFilename}`
        window.open(url, '_blank')
    }

    return (
        <Card className="p-6 max-w-md px-4 ">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Download Model</h3>
                        <p className="text-sm text-muted-foreground">
                            Download your trained machine learning model
                        </p>
                    </div>
                    <div className="p-2 rounded-full bg-primary/5">
                        <FileDown className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <div className={cn(
                    "px-4 rounded-lg border",
                    modelFilename ? "bg-primary/5 border-primary/10" : "bg-muted border-muted-foreground/20"
                )}>
                    <p className="text-sm font-medium truncate">
                        {modelFilename || "No model available for download"}
                    </p>
                </div>

                <Button 
                    onClick={handleDownload} 
                    disabled={!modelFilename}
                    className="w-full"
                >
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Download Model</span>
                    </div>
                </Button>
            </div>
        </Card>
    )
}

export default DownloadModel
