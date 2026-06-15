'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Link2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      toast.success('Logged in successfully!');
      login(data.token, data.user);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to log in. Please check your credentials.';
      toast.error(message);
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh-light px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3 mb-2 scale-100 hover:scale-105 transition-transform duration-300">
            <div className="h-11 w-11 rounded-xl bg-purple-600 bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-500/10">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              ShortlyX
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Sign in to manage your short links and track analytics
          </p>
        </div>

        <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome Back</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Enter your credentials to access your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-350 text-xs font-bold tracking-wide uppercase">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="border-slate-800 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-purple-500/10 rounded-xl h-11 transition-all text-sm"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 font-medium mt-1 pl-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-350 text-xs font-bold tracking-wide uppercase">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-slate-800 bg-slate-900/60 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-purple-500/10 rounded-xl h-11 transition-all text-sm"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-rose-600 font-medium mt-1 pl-1">{errors.password.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full glow-btn-primary rounded-xl h-11 font-semibold text-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center text-xs font-medium text-slate-400">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-purple-400 hover:text-purple-350 font-semibold underline underline-offset-4 decoration-purple-500/20 hover:decoration-purple-500 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
