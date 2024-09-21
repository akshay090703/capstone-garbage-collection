'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Recycle, Trash2, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const materialInfo = {
    cardboard: {
        color: 'amber',
        icon: '📦',
        title: 'Cardboard',
        description: 'Cardboard is recyclable and biodegradable.',
        instructions: [
            'Remove any tape or labels',
            'Flatten boxes to save space',
            'Keep dry and clean',
            'Place in the designated cardboard recycling bin'
        ]
    },
    glass: {
        color: 'sky',
        icon: '🍶',
        title: 'Glass',
        description: 'Glass is 100% recyclable and can be recycled endlessly without loss in quality.',
        instructions: [
            'Rinse containers thoroughly',
            'Remove caps and lids',
            'Separate by color if required',
            'Place in the glass recycling bin'
        ]
    },
    paper: {
        color: 'yellow',
        icon: '📄',
        title: 'Paper',
        description: 'Paper is recyclable and can be turned into new paper products.',
        instructions: [
            'Keep paper clean and dry',
            'Remove any plastic wrapping',
            'Shred sensitive documents',
            'Place in the paper recycling bin'
        ]
    },
    trash: {
        color: 'zinc',
        icon: '🗑️',
        title: 'General Waste',
        description: 'This item is not recyclable and should be disposed of in general waste.',
        instructions: [
            'Ensure the item cannot be recycled or composted',
            'Place in a sealed bag',
            'Dispose of in the general waste bin',
            'Consider ways to reduce non-recyclable waste'
        ]
    },
    plastic: {
        color: "emerald",
        icon: '♳',
        title: 'Plastic',
        description: 'Many types of plastic can be recycled into new plastic products.',
        instructions: [
            'Check the recycling symbol and number',
            'Rinse containers to remove food residue',
            'Remove caps and labels if possible',
            'Place in the plastic recycling bin'
        ]
    },
    metal: {
        color: 'rose',
        icon: '🥫',
        title: 'Metal',
        description: 'Metals like aluminum and steel are highly recyclable.',
        instructions: [
            'Rinse containers to remove food residue',
            'Remove paper labels if possible',
            'Crush cans to save space (optional)',
            'Place in the metal recycling bin'
        ]
    }
}

export default function Result() {
    const searchParams = useSearchParams()
    const predictedClass = searchParams.get('predictedClass') as keyof typeof materialInfo || 'trash'
    const material = materialInfo[predictedClass]
    const [activeInstruction, setActiveInstruction] = useState<number | null>(null)

    return (
        <div className="container mx-auto py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-3xl mx-auto overflow-hidden">
                    <CardHeader className={`bg-${material.color}-500 text-black dark:text-white p-6`}>
                        <CardTitle className="text-4xl font-bold text-center flex items-center justify-center">
                            <motion.span
                                className="mr-4 text-5xl"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                {material.icon}
                            </motion.span>
                            {material.title} Detected
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <motion.div
                            className={`bg-${material.color}-100 dark:bg-${material.color}-900 p-6 rounded-lg mb-6`}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className={`text-2xl font-semibold mb-4 flex items-center text-${material.color}-800 dark:text-${material.color}-100`}>
                                <Info className="mr-2" /> Material Information
                            </h3>
                            <p className={`text-${material.color}-700 dark:text-${material.color}-200 text-lg`}>{material.description}</p>
                        </motion.div>
                        <motion.div
                            className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-2xl font-semibold mb-4 flex items-center text-blue-800 dark:text-blue-100">
                                <Recycle className="mr-2" /> Disposal Instructions
                            </h3>
                            <ul className="space-y-4">
                                {material.instructions.map((instruction, index) => (
                                    <motion.li
                                        key={index}
                                        className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${activeInstruction === index
                                            ? 'bg-blue-200 dark:bg-blue-800'
                                            : 'bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900'
                                            }`}
                                        onClick={() => setActiveInstruction(activeInstruction === index ? null : index)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-start">
                                            <CheckCircle2 className={`mr-3 flex-shrink-0 h-6 w-6 ${activeInstruction === index ? 'text-blue-500' : 'text-blue-300'
                                                }`} />
                                            <span className="text-blue-700 dark:text-blue-200 text-lg">{instruction}</span>
                                        </div>
                                        <AnimatePresence>
                                            {activeInstruction === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="mt-2 text-blue-600 dark:text-blue-300"
                                                >
                                                    Additional tips and information about this step can be added here.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        {predictedClass === 'trash' && (
                            <motion.div
                                className="mt-6 bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h3 className="text-2xl font-semibold mb-4 flex items-center text-yellow-800 dark:text-yellow-100">
                                    <AlertTriangle className="mr-2" /> Waste Reduction Tips
                                </h3>
                                <p className="text-yellow-700 dark:text-yellow-200 text-lg">
                                    Consider ways to reduce non-recyclable waste in the future. Look for reusable alternatives or products with less packaging.
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between p-6 bg-gray-50 dark:bg-gray-800">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/upload" className="flex items-center">
                                <ArrowLeft className="mr-2" /> Upload Another
                            </Link>
                        </Button>
                        <Button asChild size="lg" className={`bg-${material.color}-500 hover:bg-${material.color}-600 text-white`}>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}