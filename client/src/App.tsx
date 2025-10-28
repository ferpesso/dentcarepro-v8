import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Utentes from "./pages/Utentes";
import UtenteDetail from "./pages/UtenteDetail";
import AgendaAvancadaV2 from "./pages/AgendaAvancadaV2";
import Faturacao from "./pages/Faturacao";
import Ajustes from "./pages/Ajustes";
import DentistaComissoes from "./pages/DentistaComissoes";
import Laboratorios from "./pages/Laboratorios";
import ContasPagar from "./pages/ContasPagar";
import IAFinanceira from "./pages/IAFinanceira";

function Router() {
  return (
    <Switch>
      {/* Rota pública de login */}
      <Route path={"/login"} component={Login} />
      
      {/* Rotas protegidas */}
      <Route path={"/:rest*"}>
        {(params) => (
          <ProtectedRoute>
            <Switch>
              <Route path={"/"} component={Home} />
              <Route path={"/utentes"} component={Utentes} />
              <Route path={"/utentes/:id"} component={UtenteDetail} />
              <Route path={"/agenda"} component={AgendaAvancadaV2} />
              <Route path={"/consultas"} component={AgendaAvancadaV2} />
              <Route path={"/faturacao"} component={Faturacao} />
              <Route path={"/ajustes"} component={Ajustes} />
              <Route path={"/dentistas/:id/comissoes"} component={DentistaComissoes} />
              <Route path={"/laboratorios"} component={Laboratorios} />
              <Route path={"/contas-pagar"} component={ContasPagar} />
              <Route path={"/ia-financeira"} component={IAFinanceira} />
              <Route path={"/404"} component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </ProtectedRoute>
        )}
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
