
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [error, setError] = useState(null);

    const onSubmit = async (values) => {
        setError(null);
        try {
            const { email, password } = values;
            const { data } = await axios.post("/api/login", { email, password });
            console.log(data);
            reset();
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full border p-2 rounded"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                            className="w-full border p-2 rounded"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};
