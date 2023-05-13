import { useEffect, useRef, useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  Box,
  Typography,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button
} from "@mui/material";
import HeaderLogo from "~/assets/images/header-logo.svg";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useNavigate } from "react-router-dom";
import { login } from "../slice";

export const LoginContainer = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);
  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (accountRef.current && passwordRef.current) {
      dispatch(login({ account: accountRef.current.value, password: passwordRef.current.value }));
    }
  };

  useEffect(() => {
  navigate("/admin/orders");
    // if (isAuthenticated) {
    //   navigate("/admin/orders");
    // }
  }, [isAuthenticated]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box component="img" src={HeaderLogo} sx={{ width: "200px", height: "200px" }} />
        <Typography variant="h2" component="div" sx={{ my: 3 }}>
          後台登入
        </Typography>
        {/* Account */}
        <FormControl sx={{ my: 2, width: "100%" }} variant="outlined">
          <InputLabel htmlFor="account">Account</InputLabel>
          <OutlinedInput
            inputProps={{ ref: accountRef }}
            id="account"
            placeholder="Please enter account"
            label="Account"
          />
        </FormControl>
        {/* Password */}
        <FormControl sx={{ my: 2, width: "100%" }} variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            inputProps={{ ref: passwordRef }}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Please enter password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button variant="contained" sx={{ my: 3, width: "100%" }} onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default LoginContainer;
