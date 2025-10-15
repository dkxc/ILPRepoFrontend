import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "./providers/ThemeProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ILP Repo</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <MantineProvider>{children}</MantineProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
