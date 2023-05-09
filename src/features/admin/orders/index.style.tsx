import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  List,
  ListItem,
  Switch,
  LinearProgress,
  LinearProgressProps,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const StyledAccordion = styled(Accordion)({
  backgroundColor: "white",
  boxShadow: "0 0 0 0",
  borderRadius: "0 !important"
});

const Column = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px"
});

const Row = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px",
  gap: "24px",
  width: "100%"
});

const Divider = styled("div")({
  height: "32px",
  width: "1px",
  background: "#F2F2F2"
});

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface IInnerContentProps {
  tag: string;
  title: string;
  listItems: string[];
}

interface IAccordionProps {
  uid: string;
  title: string;
  timestamp: string;
  innerContent?: IInnerContentProps[];
}

export const CustomizedAccordions: React.FC<IAccordionProps> = ({ uid, title, timestamp }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <Box>
      <StyledAccordion expanded={expanded} onChange={handleExpand}>
        <AccordionSummary
          sx={{
            flexDirection: "row-reverse",
            borderBottom: expanded ? "1px solid #F2F2F2" : null
          }}
          expandIcon={
            expanded ? (
              <Box
                width={40}
                height={40}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative"
                }}
              >
                <RemoveIcon
                  sx={{
                    fontSize: "0.875rem",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
              </Box>
            ) : (
              <Box
                width={40}
                height={40}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <AddIcon
                  sx={{
                    fontSize: "0.875rem",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
              </Box>
            )
          }
        >
          <Row>
            <Divider />
            <Typography sx={{ flex: "0 50%" }}>{uid}xxx-xxx-xxx</Typography>
            <Divider />
            <Column sx={{ flex: "0 50%" }}>
              <Typography variant="body1" fontWeight={700}>
                {title}內用
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {title}編號xxx-xxx
              </Typography>
            </Column>
            <Divider />
            <Typography sx={{ flex: "0 100%" }}>{timestamp}23/05/26 09:22</Typography>
            <Divider />
            <Box width={"100%"}>
              <LinearProgressWithLabel value={50} />
            </Box>
          </Row>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ marginBottom: "0.75rem" }}>
            <ListItem sx={{ borderBottom: "1px solid #F2F2F2" }}>
              <Row>
                <Typography variant="h5" fontWeight={900}>
                  {"item.tag"}
                </Typography>
                <Typography variant="h5" fontWeight={900}>
                  {"item.title"}
                </Typography>
                <List>
                  <ListItem>{"listItem"}</ListItem>
                </List>
                <Switch />
              </Row>
            </ListItem>
          </List>
          <Box>
            <Button variant="outlined" sx={{ borderRadius: 0, padding: "0.75rem 1.5rem" }}>
              <Typography variant="body1" fontWeight={700}>
                取消訂單
              </Typography>
            </Button>
          </Box>
        </AccordionDetails>
      </StyledAccordion>
    </Box>
  );
};

export default CustomizedAccordions;
