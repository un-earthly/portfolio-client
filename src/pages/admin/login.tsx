import Router from 'next/router';
import React, { useState } from 'react';

interface LoginFormProps {
    onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // console.log(username, password);
        if (username === "nscorpio" && password === "scorp1369") {
            window.localStorage.setItem("userAuthKey", "scorp")
        }
        Router.push("/admin")
        console.log(window.localStorage.getItem("userAuthKey"))
    };

    return (
        <form className="bg-gray-800 p-6 rounded-lg h-screen shadow-xl flex flex-col items-center justify-center" onSubmit={handleSubmit}>
            <div className="lg:w-1/2 w-full">
                <h2 className="text-3xl text-center font-bold mb-4">Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="w-full border outline-none border-gray-400 p-2 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full border outline-none border-gray-400 p-2 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-indigo-500 w-full text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
                >
                    Login
                </button>
            </div>
        </form>
    )
}

export default LoginForm
