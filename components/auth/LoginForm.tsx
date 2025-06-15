'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login } from '@/lib/auth';
import { Loader2, Code, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = login(email, password);
      if (user) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-40"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8 p-6">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Code className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              BugVerse
            </h1>
            <p className="text-lg font-medium text-gray-600">By Dev</p>
            <p className="text-gray-500">Frontend Demo Showcase</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-xl bg-white/80 border border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
            <CardDescription className="text-gray-600">
              Choose a demo account or enter credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 bg-white/60 border-white/40 focus:bg-white/80 focus:border-indigo-300 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 bg-white/60 border-white/40 focus:bg-white/80 focus:border-indigo-300 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50/80 border-red-200/50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in to BugVerse'
                )}
              </Button>
            </form>

            {/* Quick Demo Access */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-gray-700 text-center">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('dev@company.com')}
                  className="h-10 text-sm bg-white/60 hover:bg-white/80 border-indigo-200 hover:border-indigo-300"
                >
                  Developer View
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('DJ@company.com')}
                  className="h-10 text-sm bg-white/60 hover:bg-white/80 border-purple-200 hover:border-purple-300"
                >
                  Manager View
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500">
                Password: <span className="font-mono">password123</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
            🎯 <strong>Frontend Demo:</strong> All data is stored in memory for showcase purposes
          </p>
        </div>
      </div>
    </div>
  );
}