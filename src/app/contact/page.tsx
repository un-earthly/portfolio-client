'use client'
import { useReducer, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'motion/react';
import { Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/* ── Brand icons (lucide ships generic ones — these are the real logos) ──── */
type IconProps = { className?: string };

function WhatsAppIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.736-.979zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
    );
}

function GitHubIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.83 1.21 1.83 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.24-3.15-.12-.3-.54-1.5.12-3.15 0 0 1.01-.32 3.3 1.2.96-.26 1.98-.39 3-.4 1.02 0 2.04.14 3 .4 2.28-1.52 3.29-1.2 3.29-1.2.66 1.65.24 2.85.12 3.15.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.83.56C20.57 21.88 24 17.48 24 12.29 24 5.78 18.63.5 12 .5z" />
        </svg>
    );
}

function LinkedInIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
    );
}

function XIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

/* ── Contact / social links shown in the dock ────────────────────────────── */
const contactLinks = [
    { label: 'Email', href: 'mailto:md.c.alamin00@gmail.com', Icon: Mail, hover: 'group-hover:text-cyan-300', glow: 'group-hover:bg-cyan-500/20' },
    { label: 'WhatsApp', href: 'https://wa.me/8801560049402', Icon: WhatsAppIcon, hover: 'group-hover:text-green-400', glow: 'group-hover:bg-green-500/20' },
    { label: 'GitHub', href: 'https://github.com/un-earthly', Icon: GitHubIcon, hover: 'group-hover:text-white', glow: 'group-hover:bg-white/15' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alamin-md/', Icon: LinkedInIcon, hover: 'group-hover:text-blue-400', glow: 'group-hover:bg-blue-500/20' },
    { label: 'X', href: 'https://x.com/4qrab', Icon: XIcon, hover: 'group-hover:text-white', glow: 'group-hover:bg-white/15' },
] as const;

type ContactLink = (typeof contactLinks)[number];

/* ── A single magnifying dock icon with a hover-reveal title ──────────────── */
function DockItem({ link, reduced }: { link: ContactLink; reduced: boolean }) {
    const { label, href, Icon, hover, glow } = link;
    const external = href.startsWith('http');
    return (
        <motion.a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={label}
            whileHover={reduced ? undefined : { y: -10, scale: 1.18 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-gray-400 transition-colors duration-200"
        >
            {/* color glow behind the icon on hover */}
            <span className={`absolute inset-0 rounded-2xl bg-transparent blur-md transition-colors duration-300 ${glow}`} />
            <Icon className={`relative h-5 w-5 transition-colors duration-200 ${hover}`} />
            {/* hover-reveal title */}
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:-top-11 group-hover:opacity-100">
                {label}
                <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-black/85" />
            </span>
        </motion.a>
    );
}

/* ── The dock itself — glassmorphism container ────────────────────────────── */
function Dock({ className = '' }: { className?: string }) {
    const reduced = useReducedMotion() ?? false;
    return (
        <div
            className={`flex items-center gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-2.5 shadow-2xl shadow-black/40 backdrop-blur-2xl ${className}`}
        >
            {contactLinks.map((link) => (
                <DockItem key={link.label} link={link} reduced={reduced} />
            ))}
        </div>
    );
}

/* ── Scroll / load animation variants ─────────────────────────────────────── */
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, delayChildren: 0.15 },
    },
};

const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
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
            return { ...state, isSubmitting: true, isSuccess: false, isError: false, errorMessage: '' };
        case 'success':
            return { ...state, isSubmitting: false, isSuccess: true, isError: false, errorMessage: '' };
        case 'error':
            return { ...state, isSubmitting: false, isSuccess: false, isError: true, errorMessage: action.errorMessage };
        default:
            return state;
    }
};

const ContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', subject: '', message: '' });
    const [formState, dispatch] = useReducer(formReducer, initialFormState);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({ type: 'submit' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                dispatch({ type: 'success' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                const data = await response.json().catch(() => null);
                dispatch({ type: 'error', errorMessage: data?.error || 'Failed to send message' });
            }
        } catch {
            dispatch({ type: 'error', errorMessage: 'Failed to send message' });
        }
    };

    const handleFormFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="relative flex min-h-[93vh] items-center justify-center px-4 pb-32 md:pb-12">
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                className="w-full max-w-lg"
            >
                <Card className="w-full space-y-8 bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-3xl font-bold">Contact me</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            Want to get in touch? Fill out the form below to send me a message.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleFormFieldChange} placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleFormFieldChange} placeholder="Enter your email" />
                                </div>
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" name="subject" value={formData.subject} onChange={handleFormFieldChange} placeholder="Enter the subject of your message" />
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" name="message" value={formData.message} onChange={handleFormFieldChange} placeholder="Enter your message" className="min-h-[100px]" />
                            </motion.div>
                            <motion.div variants={fieldVariants} className="space-y-3">
                                <Button type="submit" variant="secondary" disabled={formState.isSubmitting}>
                                    {formState.isSubmitting ? 'Sending…' : 'Send message'}
                                </Button>
                                <AnimatePresence mode="wait">
                                    {formState.isSuccess && (
                                        <motion.p
                                            key="success"
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="text-sm text-green-400"
                                        >
                                            Message sent — I&apos;ll get back to you soon.
                                        </motion.p>
                                    )}
                                    {formState.isError && (
                                        <motion.p
                                            key="error"
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="text-sm text-red-400"
                                        >
                                            {formState.errorMessage}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </form>

                        {/* Desktop / tablet — centered inline dock */}
                        <motion.div
                            variants={fieldVariants}
                            className="hidden justify-center pt-4 md:flex"
                        >
                            <Dock />
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Mobile — floating glassmorphism dock pinned to the bottom */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 md:hidden"
            >
                <Dock />
            </motion.div>
        </div>
    );
};

export default ContactForm;
