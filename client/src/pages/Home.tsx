// @ts-nocheck
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Users, Calendar, FileText, DollarSign, Activity, Stethoscope, Settings, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * All content in this page are only for example, delete if unneeded
 * When building pages, remember your instructions in Frontend Workflow, Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  // If theme is switchable in App.tsx, we can implement theme toggling like this:
  // const { theme, toggleTheme } = useTheme();

  // Use APP_LOGO (as image src) and APP_TITLE if needed

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">A carregar...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              {APP_TITLE}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sistema completo de gestão para clínicas dentárias em Portugal.
              Simplifique o seu trabalho e melhore o atendimento aos pacientes.
            </p>
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>Entrar no Sistema</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{APP_TITLE}</h1>
              <p className="text-xs text-muted-foreground">Bem-vindo, {user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Acesso rápido aos módulos do sistema
          </p>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Utentes */}
          <Link href="/utentes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Utentes</CardTitle>
                <CardDescription>
                  Gestão completa de pacientes, históricos médicos e contactos
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Consultas */}
          <Link href="/agenda">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Consultas</CardTitle>
                <CardDescription>
                  Agendamento e gestão de consultas
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Tratamentos */}
          <Card className="opacity-50">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Tratamentos</CardTitle>
              <CardDescription>
                Odontograma digital e registo de tratamentos
              </CardDescription>
              <div className="pt-2">
                <span className="text-xs bg-muted px-2 py-1 rounded">Em breve</span>
              </div>
            </CardHeader>
          </Card>

          {/* Orçamentos */}
          <Card className="opacity-50">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Orçamentos</CardTitle>
              <CardDescription>
                Criação e gestão de orçamentos
              </CardDescription>
              <div className="pt-2">
                <span className="text-xs bg-muted px-2 py-1 rounded">Em breve</span>
              </div>
            </CardHeader>
          </Card>

          {/* Faturação */}
          <Link href="/faturacao">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Faturação</CardTitle>
                <CardDescription>
                  Faturamento e controlo financeiro
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* IA Financeira */}
          <Link href="/ia-financeira">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 border-purple-200">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  IA Financeira
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </CardTitle>
                <CardDescription>
                  Assistente inteligente, insights automáticos e análise de dados
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Ajustes */}
          <Link href="/ajustes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gray-500/10 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle>Ajustes</CardTitle>
                <CardDescription>
                  Configurações da clínica, dentistas e personalização
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
