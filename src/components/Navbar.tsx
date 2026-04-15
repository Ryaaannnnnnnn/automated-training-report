import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export function Navbar() {
    return (
        <nav className="bg-blue-800 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    {/* Simple Academic Cap Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                        />
                    </svg>
                    <span className="text-lg font-semibold tracking-wide">
                        Region VI AKLAN
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
