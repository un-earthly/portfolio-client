import { useReducer, useState } from 'react';
import axios from 'axios';
import { INSERT_MASSAGE_URL } from '../utilities/urls';
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
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='lg:text-4xl text-xl'>Contact Me</h1>
            <form onSubmit={handleFormSubmit} className="bg-black p-4 rounded-lg sm:w-2/3 lg:w-1/2 mx-auto">
                <label htmlFor="name" className="text-white">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormFieldChange}
                    className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
                />

                <label htmlFor="email" className="text-white">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormFieldChange}
                    className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
                />

                <label htmlFor="message" className="text-white">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormFieldChange}
                    className="bg-gray-700 text-white p-2 rounded mb-4 w-full"
                ></textarea>
                {formState.isSubmitting && <p className='text-yellow-500'>Sending message...</p>}
                {formState.isSuccess && <p className='text-green-500'>Message sent successfully!</p>}
                {formState.isError && <p className='text-red-500'>{formState.errorMessage}</p>}

                <button type="submit" className="bg-cyan-500 text-white py-2 px-4 mt-4 rounded-full w-full">
                    Send
                </button>
            </form>
        </div>



    );
}

export default ContactForm