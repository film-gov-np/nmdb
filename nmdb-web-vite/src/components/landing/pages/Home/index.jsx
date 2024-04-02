import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-8xl items-start gap-6 md:grid-cols-[1fr_3fr_2fr] lg:grid-cols-[2fr_5fr_3fr]">
        <aside className="gap-6 hidden md:grid">
          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid gap-4 text-sm text-muted-foreground">
                <NavLink to="#" className="font-semibold text-primary">
                  General
                </NavLink>
                <NavLink to="#s">Home</NavLink>
                <NavLink to="/">Movies</NavLink>
                <NavLink to="/abd">Celebrities</NavLink>
                <NavLink to="#">Movie Calendar</NavLink>
                <NavLink to="#">Cinema Hall</NavLink>
              </nav>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid gap-4 text-sm text-muted-foreground">
                <NavLink to="login" className="font-semibold text-primary">
                  Login
                </NavLink>
                <NavLink to="#">Register</NavLink>
                <NavLink to="admin">Dashboard</NavLink>
              </nav>
            </CardContent>
          </Card>
        </aside>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Movie of the week</CardTitle>
            </CardHeader>
            <CardContent className="h-44">Movies Here</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Artists</CardTitle>
            </CardHeader>
            <CardContent className="h-44">Artists Here</CardContent>
          </Card>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending</CardTitle>
            </CardHeader>
            <CardContent className="h-96">Movies Here</CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Home;
