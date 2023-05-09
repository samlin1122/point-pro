import { FC } from "react";
import { Box, Container, Grid, List, ListItem, ListItemText, Typography, Link } from "@mui/material";
import { useDeviceType } from "./slice";
import { NavLink } from "./index.styles";
import { ReactComponent as LogoText } from "~/assets/Logo_text.svg";

const siteMapData = [
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
  },
  {
    title: "Social",
    items: [
      {
        name: "Facebook",
        url: "https://www.facebook.com/pointpro.tw"
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/pointpro.tw"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/pointpro_tw"
      },
      {
        name: "Youtube",
        url: "https://www.youtube.com/channel/UC_8XKZLt-Jxbh6t7wM1Z_5A"
      }
    ]
  }
];

const SiteMapSection: FC = () => {
  const deviceType = useDeviceType();
  const handleClick = (event: React.MouseEvent, targetId: string) => {
    event.preventDefault();
    console.log(targetId);
    const targetElement = document.getElementById(targetId);
    console.log(targetElement);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <Box bgcolor={"primary.main"} py={deviceType === "tablet" ? "7.5rem" : "5rem"}>
      <Container>
        <Typography
          variant={deviceType === "tablet" ? "display3" : "h3"}
          component={"h2"}
          fontWeight={900}
          mb={deviceType === "tablet" ? 15 : 5}
        >
          無論新創或連鎖餐廳，
          <br />
          選擇"PointPro"，
          <br />
          助您業務飛躍！
        </Typography>
        <Grid container spacing={2} alignItems={"center"}>
          {siteMapData.map((item, index) =>
            index === 0 ? (
              <Grid item xs={12} md={4} key={index}>
                <Link href={item.url} onClick={(event) => handleClick(event, "hero-section")}>
                  <ListItem>
                    <LogoText />
                  </ListItem>
                </Link>
              </Grid>
            ) : (
              <Grid item xs={12} md={4} key={index}>
                <Typography variant="h6" component={"h3"} fontWeight={900} color="common.black_80">
                  {index !== 0 && item.title}
                </Typography>
                <List>
                  {item.items?.map((item, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{
                        marginBottom: "1rem"
                      }}
                    >
                      <ListItemText
                        primary={
                          <NavLink
                            href={item.url}
                            color={"common.black"}
                            onClick={(event) => handleClick(event, item.url.split("#")[1] || "")}
                          >
                            <Typography variant="h4" component={"span"} fontWeight={900}>
                              {item.name}
                            </Typography>
                          </NavLink>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default SiteMapSection;
