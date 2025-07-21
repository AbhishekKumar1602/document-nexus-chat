import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  Bot, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Building2,
  MessageSquare,
  Upload,
  Shield,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const mockWorkspaces = [
  { id: 'workspace-1', name: 'Research Team' },
  { id: 'workspace-2', name: 'Marketing Dept' },
  { id: 'workspace-3', name: 'Engineering' }
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const DashboardHeader = () => {
  const { user, logout, switchWorkspace } = useAuth();
  
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">DocuMind AI</h1>
            
            {user?.role !== 'admin' && user?.workspaces && user.workspaces.length > 1 && (
              <Select
                value={user.activeWorkspace}
                onValueChange={switchWorkspace}
              >
                <SelectTrigger className="w-48">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkspaces
                    .filter(w => user.workspaces.includes(w.id))
                    .map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    user?.role === 'admin' ? "bg-destructive" :
                    user?.role === 'workspace-admin' ? "bg-warning" : "bg-success"
                  )} />
                  <span className="text-xs capitalize">
                    {user?.role?.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const DashboardSidebar = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  
  const getNavigationItems = () => {
    const commonItems = [
      { icon: MessageSquare, label: 'Chat', path: '/', active: true },
      { icon: FileText, label: 'Documents', path: '/documents' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { icon: Building2, label: 'Workspaces', path: '/workspaces' },
        { icon: Users, label: 'All Users', path: '/users' },
        { icon: Shield, label: 'System', path: '/system' },
      ];
    }

    if (user?.role === 'workspace-admin') {
      return [
        ...commonItems,
        { icon: Upload, label: 'Upload', path: '/upload' },
        { icon: Users, label: 'Team', path: '/team' },
        { icon: Settings, label: 'Workspace', path: '/workspace-settings' },
      ];
    }

    return commonItems;
  };

  return (
    <Sidebar className={cn(
      "border-r border-sidebar-border bg-sidebar",
      collapsed ? "w-14" : "w-64"
    )}>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Bot className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold">DocuMind</h2>
                <p className="text-xs text-muted-foreground">AI Platform</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {getNavigationItems().map((item) => (
            <Button
              key={item.path}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed ? "px-2" : "px-3",
                item.active && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              Current Workspace:<br />
              <span className="font-medium">
                {mockWorkspaces.find(w => w.id === user?.activeWorkspace)?.name || 'None'}
              </span>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};