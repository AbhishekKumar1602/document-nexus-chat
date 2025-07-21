import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bot, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import heroImage from '@/assets/login-hero.jpg';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const quickLogin = (userType: string, email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Hero Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-primary/20 backdrop-blur-[2px]" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            AI-Powered Document Intelligence
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Transform your document workflows with advanced role-based access control and intelligent chat capabilities.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Advanced document Q&A with AI</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Role-based workspace management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Secure team collaboration</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DocuMind AI
          </h1>
          <p className="text-muted-foreground mt-2">
            Role-based Document Management & AI Chat Platform
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-gradient-primary-hover shadow-elegant"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Quick Login */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Demo Accounts (Click to auto-fill)
              </p>
              
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin', 'admin@demo.com', 'admin123')}
                  className="text-xs justify-start"
                >
                  <div className="w-2 h-2 bg-destructive rounded-full mr-2" />
                  System Admin - admin@demo.com
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('workspace-admin', 'workspace-admin@demo.com', 'admin123')}
                  className="text-xs justify-start"
                >
                  <div className="w-2 h-2 bg-warning rounded-full mr-2" />
                  Workspace Admin - workspace-admin@demo.com
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('member', 'member@demo.com', 'member123')}
                  className="text-xs justify-start"
                >
                  <div className="w-2 h-2 bg-success rounded-full mr-2" />
                  Member - member@demo.com
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};