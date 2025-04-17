import * as React from "react"
import { createTheme, useTheme } from "@mui/material/styles"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {
  AppProvider,
  Navigation,
  Router,
} from "@toolpad/core/AppProvider"
import {
  DashboardLayout,
  SidebarFooterProps,
} from "@toolpad/core/DashboardLayout"
import { useNavigate } from "react-router" // Import useNavigate
import { Box, Button, Divider, Stack, Typography} from "@mui/material" // Import Button
import { useAuth } from "../context/AuthContext"
import DashboardPage from "./DashBoardPage"
import EmployeeGrid from "../pages/EmployeeGrid"
import AdminPanel from "../pages/AdminPanel";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "admin",
    title: "Admin Panel",
    icon: <AdminPanelSettingsIcon />,
  },
  {
    segment: "employee",
    title: "Employees",
    icon: <PeopleAltIcon />,
  },
]

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath)

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    }
  }, [pathname])

  return router
}

export default function DashboardLayoutBasic(props: any) {
  const { window } = props
  const router = useDemoRouter("/dashboard")

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined
  const { logout } = useAuth() // Get the logout function from your context
  const navigate = useNavigate() // Get the navigate function for routing

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  function CustomAppTitle() {
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6" sx={{color: "#1967d2", fontWeight: "bold"}}>Employee Management System</Typography>
      </Stack>
    );
  }

  function SidebarFooter({ mini }: SidebarFooterProps) {
    const theme = useTheme();
    
    return (
      <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 1,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
        <Divider />
        <Button color="inherit" onClick={handleLogout} sx={{fontWeight: 'bold', color: 'inherit'}}>
          <PowerSettingsNewIcon sx={{marginRight: "10px"}}/> Logout
        </Button>
      </Box>
    )
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout slots={{appTitle: CustomAppTitle, sidebarFooter: SidebarFooter}}>
        {/* <PageContainer> */}
        {router.pathname === "/dashboard" && <DashboardPage />}
        {router.pathname === "/admin" && <AdminPanel />}{" "}
        {router.pathname === "/employee" && <EmployeeGrid />}{" "}
        {/* </PageContainer> */}
      </DashboardLayout>
    </AppProvider>
  )
}
