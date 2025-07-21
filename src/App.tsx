import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/components/auth/LoginPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents" element={<div className="p-6">Documents - Coming Soon</div>} />
        <Route path="/workspaces" element={<div className="p-6">Workspaces Management - Coming Soon</div>} />
        <Route path="/users" element={<div className="p-6">User Management - Coming Soon</div>} />
        <Route path="/system" element={<div className="p-6">System Settings - Coming Soon</div>} />
        <Route path="/upload" element={<div className="p-6">Document Upload - Coming Soon</div>} />
        <Route path="/team" element={<div className="p-6">Team Management - Coming Soon</div>} />
        <Route path="/workspace-settings" element={<div className="p-6">Workspace Settings - Coming Soon</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
