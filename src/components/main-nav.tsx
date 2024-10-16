"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Leaf, LogIn, LogOut } from "lucide-react"
import { ThemeToggle } from "./toggle-theme"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export function MainNav() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <div className="mr-4 flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Leaf className="h-6 w-6 text-green-500" />
                    </motion.div>
                    <span className="hidden font-bold sm:inline-block text-xl">
                        EcoSort
                    </span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                        href="/"
                        className={cn(
                            "transition-colors hover:text-green-500",
                            pathname === "/" ? "text-green-500" : "text-foreground/60"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/upload"
                        className={cn(
                            "transition-colors hover:text-green-500",
                            pathname?.startsWith("/upload")
                                ? "text-green-500"
                                : "text-foreground/60"
                        )}
                    >
                        Upload
                    </Link>
                    {user && (
                        <Link
                            href="/history"
                            className={cn(
                                "transition-colors hover:text-green-500",
                                pathname?.startsWith("/history")
                                    ? "text-green-500"
                                    : "text-foreground/60"
                            )}
                        >
                            History
                        </Link>
                    )}
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <ThemeToggle />
                {user ? (
                    <Button onClick={logout} variant="outline" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                ) : (
                    <Link href="/login">
                        <Button variant="outline" size="sm">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}