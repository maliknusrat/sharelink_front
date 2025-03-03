import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

const SignIn = () => {
    const [email, setEmail] = useState('');   // Changed to 'email'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!email || !password) {
            setError('All fields are required!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Example API request (replace with your own API endpoint)
            const response = await fetch('https://sharelink-tau.vercel.app/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),  // Using email for login
            });

            const result = await response.json();
            
             if (!result.success) {
                    setError("An error occurred during registration");
                  } else {
                    localStorage.setItem("token", result.data);
                    Swal.fire({
                        title: "Log In Successful",
                        icon: "success",
                        draggable: false,
                      })
                      .then((result) => {
                        if (result.isConfirmed) {
                          navigate("/");
                        }
                      });
                  }
        } catch (error) {
            setError('Network error, please try again later!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-zinc-100 dark:bg-zinc-800">
            <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-white p-7 shadow-lg sm:p-10 dark:border-zinc-700 dark:bg-zinc-900">
                <h1 className="text-3xl font-semibold tracking-tight">Sign In</h1>

                {/* Display error message if any */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-sm">
                        <label htmlFor="email" className="block text-zinc-700 dark:text-zinc-300 font-medium">
                            Email
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                            id="email"
                            placeholder="Enter Email"
                            name="email"  // Changed from 'username' to 'email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}  // Bind to 'email'
                            required
                        />
                    </div>
                    <div className="space-y-2 text-sm">
                        <label htmlFor="password" className="block text-zinc-700 dark:text-zinc-300 font-medium">
                            Password
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                            id="password"
                            placeholder="Enter password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-md bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 dark:bg-sky-700"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Submit'}
                    </button>
                </form>
                <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
                    Don&apos;t have an account?
                    <Link to="/signup" className="font-semibold underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
