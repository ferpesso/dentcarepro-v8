// @ts-nocheck
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Users,
  Calendar,
  CalendarClock,
  FileText,
  DollarSign,
  Stethoscope,
  FlaskConical,
  PiggyBank,
  TrendingUp,
  Settings,
  Sparkles,
  FileBarChart,
  Pill,
  UserCog,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// ========================================
// MENU ITEMS - Organizado por categorias
// ========================================

const menuSections = [
  {
    title: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/", badge: null },
      { icon: Calendar, label: "Agenda", path: "/agenda", badge: null },
      { icon: CalendarClock, label: "Agenda Avançada", path: "/agenda-avancada", badge: "Novo" },
    ]
  },
  {
    title: "Pacientes",
    items: [
      { icon: Users, label: "Utentes", path: "/utentes", badge: null },
      { icon: Stethoscope, label: "Tratamentos", path: "/tratamentos", badge: null },
      { icon: Pill, label: "Prescrições", path: "/prescricoes", badge: null },
    ]
  },
  {
    title: "Financeiro",
    items: [
      { icon: FileText, label: "Faturação", path: "/faturacao", badge: null },
      { icon: DollarSign, label: "Contas a Pagar", path: "/contas-pagar", badge: null },
      { icon: UserCog, label: "Comissões", path: "/dentista-comissoes", badge: null },
      { icon: TrendingUp, label: "IA Financeira", path: "/ia-financeira", badge: "IA" },
    ]
  },
  {
    title: "Gestão",
    items: [
      { icon: FlaskConical, label: "Laboratórios", path: "/laboratorios", badge: null },
      { icon: FileBarChart, label: "Relatórios", path: "/relatorios", badge: null },
    ]
  },
  {
    title: "Configurações",
    items: [
      { icon: Settings, label: "Ajustes", path: "/ajustes", badge: null },
    ]
  }
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <img
                  src={APP_LOGO}
                  alt={APP_TITLE}
                  className="h-24 w-24 rounded-2xl object-cover shadow-xl ring-2 ring-blue-100"
                />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {APP_TITLE}
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Gestão Dentária Inteligente
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            Entrar no Sistema
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Encontrar item ativo
  const activeItem = menuSections
    .flatMap(section => section.items)
    .find(item => item.path === location);

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r"
          disableTransition={isResizing}
        >
          {/* Header */}
          <SidebarHeader className="h-16 justify-center border-b">
            <div className="flex items-center gap-3 pl-2 group-data-[collapsible=icon]:px-0 transition-all w-full">
              {isCollapsed ? (
                <div className="relative h-9 w-9 shrink-0 group">
                  <img
                    src={APP_LOGO}
                    className="h-9 w-9 rounded-lg object-cover ring-2 ring-blue-100"
                    alt="Logo"
                  />
                  <button
                    onClick={toggleSidebar}
                    className="absolute inset-0 flex items-center justify-center bg-blue-600 rounded-lg ring-2 ring-blue-100 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={APP_LOGO}
                      className="h-9 w-9 rounded-lg object-cover ring-2 ring-blue-100 shrink-0"
                      alt="Logo"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold tracking-tight truncate text-base">
                        {APP_TITLE}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        Gestão Dentária
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="ml-auto h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                  >
                    <PanelLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                </>
              )}
            </div>
          </SidebarHeader>

          {/* Content - Menu organizado por seções */}
          <SidebarContent className="gap-0">
            {menuSections.map((section, sectionIndex) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4 py-2">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="px-2">
                    {section.items.map(item => {
                      const isActive = location === item.path;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={() => setLocation(item.path)}
                            tooltip={item.label}
                            className={cn(
                              "h-10 transition-all font-normal relative group/item",
                              isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4 transition-colors",
                                isActive ? "text-blue-600" : "text-muted-foreground group-hover/item:text-foreground"
                              )}
                            />
                            <span className={cn(isActive && "font-medium")}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className={cn(
                                "ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                                item.badge === "Novo" && "bg-green-100 text-green-700",
                                item.badge === "IA" && "bg-purple-100 text-purple-700"
                              )}>
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {/* Footer - User menu */}
          <SidebarFooter className="p-3 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border-2 border-blue-100 shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 border-b">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {user?.role === 'admin' ? 'Administrador' : user?.role}
                    </span>
                  </p>
                </div>
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive mt-1"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Terminar Sessão</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        
        {/* Resize handle */}
        <div
          className={cn(
            "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors",
            isCollapsed && "hidden"
          )}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      {/* Main content */}
      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                {activeItem && (
                  <>
                    <activeItem.icon className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold tracking-tight text-foreground">
                      {activeItem.label}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
