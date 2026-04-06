import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import AnimePage from "@/pages/AnimePage";
import FilmPage from "@/pages/FilmPage";
import DonghuaPage from "@/pages/DonghuaPage";
import SearchPage from "@/pages/SearchPage";
import GenrePage from "@/pages/GenrePage";
import DetailPage from "@/pages/DetailPage";
import WatchPage from "@/pages/WatchPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 5 } },
});

function Router() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/anime" component={AnimePage} />
        <Route path="/film" component={FilmPage} />
        <Route path="/donghua" component={DonghuaPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/genre/:genre" component={GenrePage} />
        <Route path="/detail/:type/:slug" component={DetailPage} />
        <Route path="/watch/:slug" component={WatchPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
