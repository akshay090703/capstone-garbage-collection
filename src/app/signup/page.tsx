import { SignupForm } from '@/components/signup-form'
import Link from 'next/link'

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <SignupForm />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-green-500 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}