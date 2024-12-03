'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, Image as ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image';

export default function Upload() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [base64Image, setBase64Image] = useState<string | null>(null) // State to hold the base64 image
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if (selectedFile) {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string) // Preview purpose
                setBase64Image(reader.result as string) // Store base64 image
            }
            reader.readAsDataURL(selectedFile) // This converts to base64
        }
    }

    useEffect(() => {
        console.log(base64Image);
    }, [base64Image])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (base64Image) {
            setIsLoading(true)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_LINK}/predict`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: base64Image }), // Send base64 string
                })

                if (response.ok) {
                    const data = await response.json()
                    router.push(`/result?predictedClass=${data.material}`)
                } else {
                    toast.error('Please login first!')
                }
            } catch (error) {
                console.error('Error:', error)
                toast.error('An error occurred while uploading the file')
            } finally {
                setIsLoading(false)
            }
        } else {
            toast.error('Please select a file to upload.')
        }
    }

    return (
        <div className="container mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Upload Waste Image</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="relative grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="image" className="text-lg">Waste Image</Label>
                                    <div className="relative h-64 border-2 border-dashed border-input rounded-lg">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={isLoading}
                                        />
                                        {preview ? (
                                            <Image src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                                width={500}
                                                height={500} />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                                                <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to select an image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button type="submit" disabled={!file || isLoading} className="bg-green-500 hover:bg-green-600 text-white">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <UploadIcon className="mr-2 h-4 w-4" /> Upload and Analyze
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
