
import { FC, useEffect, useState } from "react";
import { useDeviceType } from "./slice";
import { Box, Button, Container, Drawer, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Row } from "~/components/layout";
import { NavLink } from "./index.styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as Logo } from "~/assets/logo.svg";

const navData = [
  {
    name: "Home",
    url: "/"
  },
  {
    title: "Menu",
    items: [
      {
        name: "產品功能",
        url: "#feature"
      },
      {
        name: "價格方案",
        url: "#pricing"
      },
      {
        name: "關於我們",
        url: "#about"
      },
      {
        name: "成功案例",
        url: "#success"
      }
    ]
  }
];

interface MenuItem {
  name: string;
  url: string;
}

interface SwipeableMenuProps {
  menuItems?: MenuItem[];
}

const SwipeableMenu: FC<SwipeableMenuProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const menuList = (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
      bgcolor={"primary.main"}
      color={"common.black"}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: "1.25rem", paddingBottom: "1.25rem" }}>
        <Button
          onClick={() => toggleDrawer(false)}
          sx={{
            backgroundColor: "common.black",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.75rem 0.75rem 0.75rem 1.5rem",
            borderRadius: "1.25rem 0 0 1.25rem"
          }}
        >
          <CloseIcon />
          <Typography variant="body1" component={"span"}>
            CLOSE
          </Typography>
        </Button>
      </Box>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%"
        }}
      >
        {menuItems &&
          menuItems.map((item, index) => (
            <ListItem
              key={item.name}
              disablePadding
              sx={{
                marginBottom: "1rem",
                padding: "0.5rem 1rem"
              }}
            >
              <ListItemText
                primary={
                  <NavLink
                    href={item.url}
                    underline={"none"}
                    color={"common.black"}
                    onClick={() => toggleDrawer(false)}
                  >
                    <Typography variant="h1" component={"span"} fontWeight={900} color={"common.black"}>
                      {item.name}
                    </Typography>
                  </NavLink>
                }
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: "1.25rem", paddingBottom: "1.25rem" }}>
      <Button
        sx={{
          backgroundColor: "primary.main",
          color: "common.black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.75rem 0.75rem 0.75rem 1.5rem",
          borderRadius: "1.25rem 0 0 1.25rem",
          transform: "translateX(1.25rem)"
        }}
        onClick={() => toggleDrawer(true)}
      >
        <MenuIcon />
        <Typography variant="body1" component={"span"}>
          MENU
        </Typography>
      </Button>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{ style: { minWidth: "100vw", minHeight: "100vh" } }}
      >
        {menuList}
      </Drawer>
    </Box>
  );
};

export const HeaderNavBar: FC = () => {
  const deviceType = useDeviceType();

  const [isHidden, setIsHidden] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      setScrollTimeout(setTimeout(() => setIsHidden(false), 2000));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollTimeout]);

  return (
    <Box
      width={"100%"}
      sx={{
        transition: "transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2), height 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)",
        transform: isHidden ? "translateY(-100%)" : "translateY(0)",
        height: isHidden ? "0" : "100%",
        zIndex: 1000,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
          backdropFilter: "blur(0.5rem)"
        }
      }}
    >
      <Container maxWidth="lg">
        <Row
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%"
          }}
        >
          {navData.map((item, index) =>
            index === 0 ? (
              <Link href={item.url} key={item.name}>
                <ListItem sx={{ padding: 0 }}>
                  <Logo
                    style={{
                      height: deviceType === "tablet" ? 64 : 40,
                      aspectRatio: 1
                    }}
                  />
                </ListItem>
              </Link>
            ) : deviceType === "tablet" ? (
              <List
                key={item.title}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                  paddingTop: "1.25rem"
                }}
              >
                {deviceType === "tablet" &&
                  item.items?.map((item, index) => (
                    <ListItem
                      key={item.name}
                      disablePadding
                      sx={{
                        marginBottom: "1rem",
                        padding: "0.5rem 1rem"
                      }}
                    >
                      <ListItemText
                        primary={
                          <NavLink href={item.url} underline={"none"} color={"white"}>
                            <Typography variant="h6" component={"span"}>
                              {item.name}
                            </Typography>
                          </NavLink>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            ) : (
              <SwipeableMenu menuItems={item.items} />
            )
          )}
        </Row>
      </Container>
    </Box>
  );
};
