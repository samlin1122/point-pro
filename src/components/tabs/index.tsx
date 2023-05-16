import { FC } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { ITabsItemProps, ITabsProps } from "./types";

export const TabPanel = (props: ITabsItemProps) => {
  const { children, value, index, ...other } = props;
  return (
    <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && children}
    </Box>
  );
};

const TabsBase: FC<ITabsProps> = ({ value, tabs, onChange, sx }) => {
  return (
    <>
      <Box sx={{ width: "100%", borderBottom: 0.5, borderColor: "divider", ...sx }}>
        <Tabs
          sx={{
            "& .MuiTabs-indicator": {
              display: "relative",
              backgroundColor: "transparent",
              height: 4
            },
            "& .MuiTabs-indicator::after": {
              content: "''",
              position: "absolute",
              width: "1.5rem",
              height: "100%",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              backgroundColor: "common.black"
            }
          }}
          variant="scrollable"
          value={value}
          onChange={onChange}
        >
          {tabs.map((list) => (
            <Tab
              sx={{
                fontWeight: 400,
                fontSize: "1.5rem",
                color: "common.black_80",
                "&.Mui-selected": {
                  fontWeight: 900,
                  color: "common.black"
                },
                "&.Mui-focusVisible": {
                  backgroundColor: "common.black"
                }
              }}
              key={list.id}
              label={list.title}
              value={list.id}
            />
          ))}
        </Tabs>
      </Box>
    </>
  );
};

export default TabsBase;
