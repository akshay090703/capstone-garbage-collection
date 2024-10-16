'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface TestResult {
    userId: number
    prediction: string
    image_base64: string
    date: string
}

export default function HistoryPage() {
    const [results, setResults] = useState<TestResult[]>([])

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:5000/history', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    setResults(data)
                    console.log(data);

                } else {
                    console.error('Failed to fetch history')
                }
            } catch (error) {
                console.error('Error fetching history:', error)
            }
        }

        fetchResults()
    }, [])

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Upload History</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((result, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Card className="w-full h-80 flex flex-col">
                            <CardHeader className="flex-1 flex items-center justify-center overflow-hidden">
                                <Image
                                    className="object-cover w-full h-full"
                                    src={`data:image/jpeg;base64,${result.image_base64}`}
                                    alt={'Image of the object'}
                                    width={200}
                                    height={200}
                                />
                            </CardHeader>
                            <CardContent className="flex-none p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    {new Date(result.date).toLocaleString()}
                                </p>
                                <Link
                                    href={`/result?predictedClass=${result.prediction}`}
                                    className="text-green-500 hover:underline mt-2 inline-block"
                                >
                                    View Details
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>


        </div>
    )
}
