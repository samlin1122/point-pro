import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Column } from "~/components/layout";

interface AboutUsAvatarCardProps {
  name: string;
  title: string;
  imgUrl: string;
}

const AboutUsAvatarCard: FC<AboutUsAvatarCardProps> = ({ name, title, imgUrl }) => {
  return (
    <Grid container>
      <Grid item xs={5}>
        <Box padding="1rem" borderRadius={"2.5rem"} bgcolor={"white"}>
          <img
            src={imgUrl}
            alt={name}
            style={{
              borderRadius: "1.5rem",
              objectFit: "cover",
              width: "100%",
              height: "100%"
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={7}>
        <Column
          paddingLeft={"2rem"}
          bgcolor={"white"}
          borderRadius={"2.5rem"}
          height={"100%"}
          justifyContent={"center"}
        >
          <Typography variant="body1" fontWeight={700} component="h2" mb={0.5}>
            {name}
          </Typography>
          <Typography variant="small" color="common.black_80" component="p">
            {title}
          </Typography>
        </Column>
      </Grid>
    </Grid>
  );
};

export default AboutUsAvatarCard;
