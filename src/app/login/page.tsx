import { LoginForm } from '@/components/login-form'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <LoginForm />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-green-500 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}