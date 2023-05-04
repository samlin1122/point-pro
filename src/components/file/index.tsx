import { useState, useRef } from "react";
// Components
import { InputFile } from "~/components/input";
import { Button, Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
// Styles
// Libs

const File = ({ width }: { width: number }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | undefined>(undefined);

  const handleFileChange = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    }
  };
  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width }}>
      <Button
        color="secondary"
        onClick={handleUploadFile}
        sx={{
          width,
          height: width,
          backgroundColor: (theme) => theme.palette.common.black_20,
          "&:hover": {
            backgroundColor: (theme) => theme.palette.common.black_40
          }
        }}
      >
        {preview ? (
          <img src={preview} width="200px" />
        ) : (
          <ImageIcon color="primary" sx={{ width: "100px", height: "100px" }} />
        )}
      </Button>
      <InputFile ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
    </Box>
  );
};

export default File;
