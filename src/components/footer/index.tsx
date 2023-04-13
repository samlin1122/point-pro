import * as React from "react"
// Components
import { Box, Container, Grid, Typography, IconButton } from "@mui/material"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", py: 4 }}>
      <Container maxWidth="lg">
        {/* 第一行 */}
        <Grid container spacing={3}>
          {/* 公司介紹 */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Point Pro
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non cursus quam. Morbi malesuada ornare
              finibus.
            </Typography>
          </Grid>

          {/* 社群媒體 */}
          <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton aria-label="facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="linkedin">
              <LinkedInIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* 第二行 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Point Pro. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
