'use client'
import { useReducer, useState } from 'react';
import axios from 'axios';
import { INSERT_MASSAGE_URL } from '../utilities/urls';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

type FormState = {
    isSubmitting: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage: string;
};

type FormAction =
    | { type: 'submit' }
    | { type: 'success' }
    | { type: 'error'; errorMessage: string };

const initialFormState: FormState = {
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'submit':
            return {
                ...state,
                isSubmitting: true,
                isSuccess: false,
                isError: false,
                errorMessage: '',
            };
        case 'success':
            return {
                ...state,
                isSubmitting: false,
                isSuccess: true,
                isError: false,
                errorMessage: '',
            };
        case 'error':
            return {
                ...state,
                isSubmitting: false,
                isSuccess: false,
                isError: true,
                errorMessage: action.errorMessage,
            };
        default:
            return state
    }
};

const ContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
    });
    const [formState, dispatch] = useReducer(formReducer, initialFormState);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'submit' });

        try {
            const response = await axios.post(INSERT_MASSAGE_URL, formData);

            if (response.status === 200) {
                dispatch({ type: 'success' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                dispatch({ type: 'error', errorMessage: 'Failed to send message' });
            }
        } catch (error) {
            dispatch({ type: 'error', errorMessage: 'Failed to send message' });
        }
    };

    const handleFormFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: fieldValue,
        }));
    };

    return (
        // <div className='flex flex-col items-center justify-center h-screen'>
        //     <h1 className='lg:text-4xl text-xl'>Contact Me</h1>
        //     <form onSubmit={handleFormSubmit} className="bg-black p-4 rounded-lg sm:w-2/3 lg:w-1/2 mx-auto">
        //         <label htmlFor="name" className="text-white">
        //             Name
        //         </label>
        //         <input
        //             type="text"
        //             id="name"
        //             name="name"
        //             value={formData.name}
        //             onChange={handleFormFieldChange}
        //             className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
        //         />

        //         <label htmlFor="email" className="text-white">
        //             Email
        //         </label>
        //         <input
        //             type="email"
        //             id="email"
        //             name="email"
        //             value={formData.email}
        //             onChange={handleFormFieldChange}
        //             className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
        //         />

        //         <label htmlFor="message" className="text-white">
        //             Message
        //         </label>
        //         <textarea
        //             id="message"
        //             name="message"
        //             value={formData.message}
        //             onChange={handleFormFieldChange}
        //             className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
        //         ></textarea>
        //         {formState.isSubmitting && <p className='text-yellow-500'>Sending message...</p>}
        //         {formState.isSuccess && <p className='text-green-500'>Message sent successfully!</p>}
        //         {formState.isError && <p className='text-red-500'>{formState.errorMessage}</p>}

        //         <button type="submit" className="bg-cyan-500 text-white py-2 px-4 mt-4 rounded-full w-full">
        //             Send
        //         </button>
        //     </form>
        // </div>
        <div className="lg:min-h-[93vh] flex items-center justify-center">
            <Card className="w-full max-w-lg mx-auto space-y-8 bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl font-bold">Contact me</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                        Want to get in touch? Fill out the form below to send me a message.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Enter your name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Enter your email" type="email" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Enter the subject of your message" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Enter your message" className="min-h-[100px]" />
                    </div>
                    <Button variant='secondary'>Send message</Button>
                </CardContent>
            </Card>
        </div>


    );
}

export default ContactForm