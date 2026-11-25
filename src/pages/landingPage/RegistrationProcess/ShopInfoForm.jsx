import { TextField } from "@mui/material";

const darkInputSx = {
  "& .MuiInputLabel-root": { color: "#ADA8C3" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#AC6AFF" },
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    "& fieldset": { borderColor: "#3F3A52" },
    "&:hover fieldset": { borderColor: "#757185" },
    "&.Mui-focused fieldset": { borderColor: "#AC6AFF" },
    "& input": { color: "#ffffff" },
  },
};

const ShopInfoForm = ({ shopData, setShopData, errors = {} }) => {
  return (
    <>
      <TextField
        label="Shop Name"
        fullWidth
        margin="normal"
        value={shopData.dokaan_name}
        onChange={(e) =>
          setShopData({ ...shopData, dokaan_name: e.target.value })
        }
        error={!!errors.dokaan_name}
        helperText={errors.dokaan_name}
        sx={darkInputSx}
      />
      <TextField
        label="Shop Location"
        fullWidth
        margin="normal"
        value={shopData.dokaan_location}
        onChange={(e) =>
          setShopData({ ...shopData, dokaan_location: e.target.value })
        }
        error={!!errors.dokaan_location}
        helperText={errors.dokaan_location}
        sx={darkInputSx}
      />
      <TextField
        label="Shop Email"
        type="email"
        fullWidth
        margin="normal"
        value={shopData.dokaan_email}
        onChange={(e) =>
          setShopData({ ...shopData, dokaan_email: e.target.value })
        }
        error={!!errors.dokaan_email}
        helperText={errors.dokaan_email}
        sx={darkInputSx}
      />
      <TextField
        label="Shop Phone"
        type="tel"
        fullWidth
        margin="normal"
        value={shopData.dokaan_phone}
        onChange={(e) =>
          setShopData({ ...shopData, dokaan_phone: e.target.value })
        }
        error={!!errors.dokaan_phone}
        helperText={errors.dokaan_phone}
        sx={darkInputSx}
      />
      <TextField
        label="Shop Type (e.g., Grocery, Electronics, Fashion)"
        fullWidth
        margin="normal"
        value={shopData.dokaan_type}
        onChange={(e) =>
          setShopData({ ...shopData, dokaan_type: e.target.value })
        }
        sx={darkInputSx}
      />
    </>
  );
};

export default ShopInfoForm;
