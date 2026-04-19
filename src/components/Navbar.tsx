import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export function Navbar() {
    return (
        <nav className="bg-blue-800 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden">
                        <img 
                            src="/logo.png" 
                            alt="DICT Logo" 
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight uppercase">
                        After Training Report System
                    </span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/dashboard" className="hover:text-blue-200 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/trainings" className="hover:text-blue-200 transition-colors">
                        Trainings
                    </Link>

                    <div className="ml-2">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
