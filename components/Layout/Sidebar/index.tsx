import ApiUser from "../../../api/ApiUser";
import "./index.scss";
import {logo} from "@app/config/images";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import routes from "@app/routes/RouteList";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useMemo, useState} from "react";

const drawerWidth = 320;

interface MenuItem {
  key: string;
  title: string;
  label: string;
}

interface RenderMenuProps {
  onItemClick?: () => void;
}

const RenderMenu = React.memo(({onItemClick}: RenderMenuProps) => {
  const router = useRouter();
  const userRole = ApiUser.getUserRole();

  const menuItems = useMemo<MenuItem[]>(() => {
    return routes
      .filter(
        ({role}: any) =>
          !(role && userRole ? !role?.includes(userRole) : undefined),
      )
      .map(({path, name}) => {
        return {
          key: path,
          title: name,
          label: name,
        };
      });
  }, [userRole]);

  const handleNavigation = (path: string) => {
    router.push(path);
    onItemClick?.();
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return router.pathname === "/" || router.pathname === "/dashboard";
    }
    return router.pathname === path || router.pathname.startsWith(path);
  };

  const renderMenuItems = () => {
    return menuItems.map((item) => {
      const isItemActive = isActive(item.key);

      return (
        <React.Fragment key={item.key}>
          <ListItem
            disablePadding
            className={isItemActive ? "bg-[#734DBE14] rounded" : ""}
          >
            <ListItemButton
              onClick={() => {
                handleNavigation(item.key);
              }}
              className={`${isItemActive ? "active" : ""}`}
              sx={{
                pl: 2,
                pr: 1,
                py: 1,
                minHeight: 48,
              }}
            >
              <ListItemText
                className={isItemActive ? "text-[#734DBE]" : "text-[#637381]"}
                primary={item.title}
              />
            </ListItemButton>
          </ListItem>
        </React.Fragment>
      );
    });
  };

  return <List sx={{p: 0}}>{renderMenuItems()}</List>;
});
RenderMenu.displayName = "RenderMenu";

export default function SidebarComponent(): JSX.Element {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = (
    <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          gap: 1,
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <Image src={logo} alt="logo" width={174} height={18} />
        </Box>
      </Box>
      <Box sx={{flexGrow: 1, overflowY: "auto"}}>
        <RenderMenu onItemClick={() => setOpen(false)} />
      </Box>
      <Box sx={{px: 2, py: 2}}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: 2,
          }}
        >
          <button className="sidebar-button login-button">Đăng nhập</button>
          <button className="sidebar-button register-button">Đăng ký</button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {!open && isDesktop && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            "&:hover": {
              backgroundColor: "#FFFAF0",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box component="nav">
        {isDesktop ? (
          <Drawer
            variant={isDesktop ? "temporary" : "persistent"}
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="persistent"
            open={open}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
}
