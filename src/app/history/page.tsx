'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { FileX, Upload, Trash2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast, { Toaster } from 'react-hot-toast'

interface TestResult {
    id: string
    userId: number
    prediction: string
    image_base64: string
    date: string
}

export default function HistoryPage() {
    const [results, setResults] = useState<TestResult[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        console.log(results);

    }, [results])

    const fetchResults = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_LINK}/history`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            if (response.ok) {
                const data = await response.json()
                setResults(data)
            } else {
                console.error('Failed to fetch history')
            }
        } catch (error) {
            console.error('Error fetching history:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchResults()
    }, [])

    const handleDelete = async (recordId: string) => {
        console.log(recordId);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_LINK}/delete/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            if (response.ok) {
                fetchResults()
                toast.success('Record deleted successfully')
            } else {
                toast.error('Failed to delete record')
            }
        } catch (error) {
            console.log('Error deleting record:', error)
            toast.error('An error occurred while deleting the record')
        }
    }

    const LoadingSkeleton = () => (
        <Card className="w-full h-80 flex flex-col">
            <CardHeader className="flex-1 flex items-center justify-center overflow-hidden">
                <Skeleton className="w-full h-full" />
            </CardHeader>
            <CardContent className="flex-none p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    )

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <FileX className="w-24 h-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Upload History</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                You haven&apos;t uploaded any images for classification yet. Start by uploading an image to see your history here.
            </p>
            <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload an Image
                </Link>
            </Button>
        </div>
    )

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Upload History</h1>
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array(6).fill(0).map((_, index) => (
                        <motion.div
                            key={`skeleton-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <LoadingSkeleton />
                        </motion.div>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((result, index) => (
                        <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className="w-full h-80 flex flex-col">
                                <CardHeader className="flex-1 flex items-center justify-center overflow-hidden">
                                    <Image
                                        className="object-cover w-full h-full"
                                        src={`${result.image_base64}`}
                                        alt={'Image of the object'}
                                        width={200}
                                        height={200}
                                    />
                                </CardHeader>
                                <CardContent className="flex-none p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(result.date).toLocaleString()}
                                        </p>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="p-0 hover:bg-transparent"
                                                >
                                                    <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this record from your history.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(result.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
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
            ) : (
                <EmptyState />
            )}
            <Toaster position="top-center" />
        </div>
    )
}