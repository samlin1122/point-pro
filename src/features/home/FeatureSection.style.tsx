import { FC, ReactNode } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Column } from "~/components/layout";

interface FeatureCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

const FeatureCard: FC<FeatureCardProps> = ({ children, title, description }) => {
  return (
    <Grid container>
      <Grid item xs={9} flex={1}>
        <Column
          paddingLeft={"3rem"}
          paddingY={2.5}
          bgcolor={"white"}
          borderRadius={"2.5rem"}
          height={"100%"}
          justifyContent={"center"}
        >
          <Typography variant="h6" lineHeight={"1rem"} fontWeight={900} component="h2" mb={1}>
            {title}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            color={"common.black_80"}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </Column>
      </Grid>
      <Grid item flex={1} maxHeight={"7rem"} maxWidth={"7rem"}>
        <Box padding="0.5rem" borderRadius={"2.5rem"} bgcolor={"white"} height={"100%"} color={"primary.main"}>
          <Box
            borderRadius={"2rem"}
            padding={2}
            width={"100%"}
            height={"100%"}
            bgcolor={"rgba(247, 194, 36, 0.16)"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {children}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FeatureCard;
