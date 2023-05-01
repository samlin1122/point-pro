import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
// Libs
import { sideBarItemList } from "~/utils/constants";

interface SideBarItemOpenType {
  [keyname: string]: boolean;
}
const SideBar = () => {
  const [openList, setOpenList] = useState<SideBarItemOpenType>({});
  const navigate = useNavigate();

  useEffect(() => {
    sideBarItemList.map((e) => {
      if (e.list) {
        setOpenList({ ...openList, [e.id]: false });
      }
    });
  }, []);

  const handleClick = (item) => {
    if (item.path) {
      navigate({ pathname: `/admin/${item.path}` });
    } else {
      setOpenList((value) => ({ ...value, [item.id]: !value[item.id] }));
    }
  };
  return (
    <Box sx={{ paddingTop: "88px", overflow: "auto" }}>
      <List>
        {sideBarItemList.map((item) => (
          <Fragment key={item.id}>
            <ListItem disablePadding onClick={() => handleClick(item)}>
              <ListItemButton>
                <ListItemIcon>{item.src ? <item.src /> : null}</ListItemIcon>
                <ListItemText primary={item.name} />
                {item.list ? (
                  <KeyboardArrowDown sx={{ transform: `rotate(${openList[item.id] ? 180 : 0}deg)` }} />
                ) : null}
              </ListItemButton>
            </ListItem>
            {item.list && openList[item.id] ? (
              <List sx={{ pl: 7 }}>
                {item.list.map((e) => (
                  <ListItem key={e.id} disablePadding onClick={() => handleClick(e)}>
                    <ListItemButton>
                      <ListItemText primary={e.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Fragment>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;
