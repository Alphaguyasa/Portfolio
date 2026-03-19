"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import {
	Check,
	Copy,
	LucideIcon,
	Mail,
	MapPin,
	GithubIcon,
	LinkedinIcon,
} from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

const APP_EMAIL = 'alphaguyasa@gmail.com';
const APP_LOCATION = 'Haramaya University, Harar, Ethiopia';

export function ContactPage({ isDark }: { isDark: boolean }) {
	const socialLinks = [
		{
			icon: GithubIcon,
			href: 'https://github.com/Alphaguyasa',
			label: 'GitHub',
		},
		{
			icon: LinkedinIcon,
			href: 'https://www.linkedin.com/in/alpha-guyasa-a2b567328',
			label: 'LinkedIn',
		},
	];

	return (
		<div
			className="min-h-screen w-full transition-colors duration-300"
			style={{ backgroundColor: isDark ? 'hsl(0 0% 0%)' : 'hsl(0 0% 98%)', color: isDark ? 'hsl(0 0% 100%)' : 'hsl(0 0% 10%)' }}
		>
			<div className="mx-auto h-full max-w-6xl lg:border-x" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
				<div className="flex grow flex-col justify-center px-4 md:px-6 pt-32 pb-16">
					<h1 className="text-4xl font-bold md:text-5xl">
						Contact Me
					</h1>
					<p className="mb-5 text-base" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
						Let's build something secure and powerful together.
					</p>
				</div>
				<div className="relative inset-x-0 h-px w-full border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
				<div className="grid md:grid-cols-2">
					<Box
						icon={Mail}
						title="Email"
						description="I respond to all emails within 24 hours."
						isDark={isDark}
					>
						<a
							href={`mailto:${APP_EMAIL}`}
							className="font-mono text-base font-medium tracking-wide hover:underline"
							style={{ color: '#C3E41D' }}
						>
							{APP_EMAIL}
						</a>
						<CopyButton className="size-6" test={APP_EMAIL} />
					</Box>
					<Box
						icon={MapPin}
						title="Location"
						description="Based in Ethiopia, available for remote work worldwide."
						isDark={isDark}
						className="md:border-r-0"
					>
						<span className="font-mono text-base font-medium tracking-wide">
							{APP_LOCATION}
						</span>
					</Box>
				</div>
				<div className="relative inset-x-0 h-px w-full border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
				<div className="relative flex h-full min-h-[320px] items-center justify-center">
					<div
						className={cn(
							'z--10 absolute inset-0 size-full',
							'bg-[radial-gradient(color-mix(in_oklab,var(--foreground)30%,transparent)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,var(--background)_30%,transparent)]',
						)}
					/>
					<div className="relative z-1 space-y-6">
						<h2 className="text-center text-3xl font-bold md:text-4xl">
							Find me online
						</h2>
						<div className="flex flex-wrap items-center justify-center gap-4">
							{socialLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-x-2 rounded-full border px-4 py-2 transition-colors duration-300"
									style={{
										borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
										backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
										color: isDark ? 'white' : '#020202',
									}}
								>
									<link.icon className="size-4" />
									<span className="font-mono text-sm font-medium tracking-wide">
										{link.label}
									</span>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type ContactBox = React.ComponentProps<'div'> & {
	icon: LucideIcon;
	title: string;
	description: string;
	isDark: boolean;
};

function Box({ title, description, className, children, isDark, ...props }: ContactBox) {
	return (
		<div className={cn('flex flex-col justify-between border-b md:border-r md:border-b-0', className)}
			style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
		>
			<div className="flex items-center gap-x-3 border-b p-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
				<props.icon className="size-5" strokeWidth={1} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }} />
				<h2 className="font-heading text-lg font-medium tracking-wider">{title}</h2>
			</div>
			<div className="flex items-center gap-x-2 p-4 py-12">{children}</div>
			<div className="border-t p-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
				<p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{description}</p>
			</div>
		</div>
	);
}

type CopyButtonProps = ButtonProps & { test: string };

function CopyButton({ className, variant = 'ghost', size = 'icon', test, ...props }: CopyButtonProps) {
	const [copied, setCopied] = React.useState<boolean>(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(test);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={cn('disabled:opacity-100', className)}
			onClick={handleCopy}
			aria-label={copied ? 'Copied' : 'Copy to clipboard'}
			disabled={copied || props.disabled}
			{...props}
		>
			<div className={cn('transition-all', copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
				<Check className="size-3.5 stroke-emerald-500" aria-hidden="true" />
			</div>
			<div className={cn('absolute transition-all', copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}>
				<Copy aria-hidden="true" className="size-3.5" />
			</div>
		</Button>
	);
}
