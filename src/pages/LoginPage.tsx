// src/pages/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Keep this import
import { auth } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

// Icons - color will be adjusted by parent's class
const EmailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PasswordIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const GoogleIcon = () => (
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
);

const SunIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" />
    </svg>
);

const MoonIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21c3.935 0 7.348-2.024 9.002-5.002z" />
    </svg>
);


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Default to light theme (false)

    const navigate = useNavigate(); // 👉 Moved here, inside the component

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
    };

    const handleEmailAuth = async () => {
        setError("");
        if (isSignup && password !== confirmPassword) {
            setError("Confirmation password does not match.");
            return;
        }
        setIsLoading(true);
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Account created successfully! Please sign in.");
                setIsSignup(false);
                setEmail(""); setPassword(""); setConfirmPassword("");
                // Don't navigate immediately after registration, let the user sign in
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                navigate("/home"); // 👉 Navigate after successful login
            }
        } catch (err: any) {
            let friendlyMessage = "An error occurred. Please try again.";
            switch (err.code) {
                case "auth/user-not-found": case "auth/wrong-password":
                    friendlyMessage = "Incorrect email or password."; break;
                case "auth/email-already-in-use":
                    friendlyMessage = "This email is already registered."; break;
                case "auth/weak-password":
                    friendlyMessage = "Password must be at least 6 characters."; break;
                case "auth/invalid-email":
                    friendlyMessage = "Please enter a valid email address."; break;
                default: break; // You might want to log err.message for unhandled Firebase errors during development
            }
            setError(friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(""); setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/home"); // 👉 Navigate after successful Google login
        }
        catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') setError("Google sign-in was canceled.");
            else setError(err.message || "Could not sign in with Google.");
        } finally { setIsLoading(false); }
    };

    const handleAnonymousLogin = async () => {
        setError(""); setIsLoading(true);
        try {
            await signInAnonymously(auth);
            navigate("/home"); // 👉 Navigate after successful anonymous login
        }
        catch (err: any) { setError(err.message || "Could not sign in anonymously."); }
        finally { setIsLoading(false); }
    };

    const toggleAuthMode = () => {
        setIsSignup(!isSignup); setError("");
    };

    // Theme-dependent classes (this part remains the same logic)
    const pageBgClasses = isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
        : "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-100";
    const cardClasses = isDarkMode
        ? "bg-gray-800/80 backdrop-blur-lg"
        : "bg-white/90 backdrop-blur-lg";
    const textPrimaryClasses = isDarkMode ? "text-gray-100" : "text-gray-800";
    const textSecondaryClasses = isDarkMode ? "text-gray-400" : "text-gray-500";
    const inputClasses = isDarkMode
        ? "bg-gray-700/60 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-600 focus:border-indigo-600";
    const iconInputClasses = isDarkMode
        ? "text-gray-400 group-focus-within:text-indigo-400"
        : "text-gray-500 group-focus-within:text-indigo-600";
    const primaryButtonClasses = isDarkMode
        ? "bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white shadow-xl hover:shadow-indigo-500/30 focus:ring-offset-gray-800 focus:ring-indigo-500"
        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/40 focus:ring-offset-white focus:ring-indigo-500";
    const googleButtonClasses = isDarkMode
        ? "bg-gray-700/70 border-gray-600 hover:bg-gray-600/70 text-gray-200 hover:shadow-indigo-500/20"
        : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-indigo-500/20";
    const linkClasses = isDarkMode
        ? "text-indigo-400 hover:text-indigo-300"
        : "text-indigo-600 hover:text-indigo-800";
    const hrClasses = isDarkMode ? "border-gray-600" : "border-gray-300";
    const orTextClasses = isDarkMode ? "text-gray-500 bg-gray-800/0" : `text-gray-400 ${cardClasses.includes("bg-white") ? "bg-white" : "bg-gray-50"}/0`;
    const errorMsgClasses = isDarkMode
        ? "bg-red-500/20 border-red-500/50 text-red-300"
        : "bg-red-100 border-l-4 border-red-500 text-red-700";
    const themeToggleBg = isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-slate-300 hover:bg-slate-400";
    const themeToggleIconColor = isDarkMode ? "text-yellow-400" : "text-indigo-700";


    // JSX (this part remains the same logic)
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ease-in-out ${pageBgClasses} selection:bg-indigo-500 selection:text-white`}>
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full shadow-md transition-colors duration-200 ${themeToggleBg}`}
                    aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                >
                    {isDarkMode ? <SunIcon className={`w-6 h-6 ${themeToggleIconColor}`} /> : <MoonIcon className={`w-6 h-6 ${themeToggleIconColor}`} />}
                </button>
            </div>

            <div className={`max-w-md w-full p-8 md:p-10 rounded-xl shadow-2xl space-y-6 transform transition-all hover:scale-[1.01] ${cardClasses}`}>
                <div className="text-center">
                    <h1 className={`text-3xl font-bold ${textPrimaryClasses}`}>
                        {isSignup ? "Create New Account" : "Sign In to SmartMeal"}
                    </h1>
                    <p className={`text-sm mt-1 ${textSecondaryClasses}`}>
                        {isSignup ? "Join the SmartMeal community." : "Access your smart meal plan."}
                    </p>
                </div>

                {error && (
                    <div className={`p-3 rounded-md text-sm text-center ${errorMsgClasses}`} role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <EmailIcon className={`w-5 h-5 ${iconInputClasses}`} />
                        </div>
                        <input
                            type="email" placeholder="Email Address"
                            className={`w-full pl-11 pr-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${inputClasses}`}
                            value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <PasswordIcon className={`w-5 h-5 ${iconInputClasses}`} />
                        </div>
                        <input
                            type="password" placeholder="Password"
                            className={`w-full pl-11 pr-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${inputClasses}`}
                            value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}
                        />
                    </div>
                    {isSignup && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <PasswordIcon className={`w-5 h-5 ${iconInputClasses}`} />
                            </div>
                            <input
                                type="password" placeholder="Confirm Password"
                                className={`w-full pl-11 pr-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${inputClasses}`}
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={isSignup} disabled={isLoading}
                            />
                        </div>
                    )}
                    <button
                        type="submit" disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out ${primaryButtonClasses} ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${isDarkMode || primaryButtonClasses.includes('text-white') ? 'text-white' : 'text-indigo-700'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (isSignup ? "Sign Up Now" : "Sign In")}
                    </button>
                </form>

                {!isSignup && (
                    <>
                        <div className="flex items-center justify-center my-2">
                            <hr className={`w-full ${hrClasses}`} />
                            <span className={`px-3 text-xs ${orTextClasses}`}>OR</span>
                            <hr className={`w-full ${hrClasses}`} />
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleLogin} disabled={isLoading}
                                className={`w-full py-2.5 rounded-lg font-medium flex justify-center items-center gap-2.5 shadow-md transition-all duration-150 ease-in-out ${googleButtonClasses} ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>
                            <button
                                onClick={handleAnonymousLogin} disabled={isLoading}
                                className={`w-full text-sm hover:underline text-center py-1 ${linkClasses} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                Sign in as Guest
                            </button>
                        </div>
                    </>
                )}

                <div className={`text-center text-sm ${textSecondaryClasses}`}>
                    {isSignup ? "Already have an account? " : "Don't have an account? "}
                    <button onClick={toggleAuthMode} disabled={isLoading} className={`font-semibold hover:underline ${linkClasses}`}>
                        {isSignup ? "Sign In" : "Create new account"}
                    </button>
                </div>
            </div>
            <footer className={`text-center text-xs mt-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                <p>&copy; {new Date().getFullYear()} SmartMeal</p>
            </footer>
        </div>
    );
}