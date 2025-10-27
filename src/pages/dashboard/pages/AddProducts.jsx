aimport { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Divider,
  Switch,
  Box,
  Stack,
} from "@mui/material";
// import { useMediaQuery } from "@mui/material";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    code: "",
    purchasePrice: "",
    salesPrice: "",
    initialStock: "",
    description: "",
    isEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Submit data: ", { ...productData });
      setMessage("Product added successfully!");
      setProductData({
        name: "",
        code: "",
        purchasePrice: "",
        salesPrice: "",
        initialStock: "",
        description: "",
        isEnabled: true,
      });
    } catch (error) {
      setMessage("Error adding product. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const themeStyles = darkMode
    ? {
        backgroundColor: "#000000",
        color: "#ffffff",
        inputBackground: "#333333",
        dividerColor: "#444",
        buttonBackground: "#6200ea",
        buttonHover: "#3700b3",
      }
    : {
        backgroundColor: "transparent",
        color: "#000000",
        inputBackground: "#f9f9f9",
        dividerColor: "#e0e0e0",
        buttonBackground: "#1976d2",
        buttonHover: "#115293",
      };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: themeStyles.backgroundColor,
        color: themeStyles.color,
        p: 3,
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 3,
          bgcolor: themeStyles.inputBackground,
          borderRadius: 3,
          boxShadow: 4,
          transition: "background-color 0.3s, box-shadow 0.3s",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Add New Product
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body1">Enable:</Typography>
          <Switch
            checked={productData.isEnabled}
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                isEnabled: e.target.checked,
              }))
            }
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Product Name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ backgroundColor: themeStyles.inputBackground }}
          />
          <TextField
            label="Product Code"
            name="code"
            value={productData.code}
            onChange={handleInputChange}
            fullWidth
            sx={{ backgroundColor: themeStyles.inputBackground }}
          />
        </Stack>

        <Divider sx={{ my: 2, bgcolor: themeStyles.dividerColor }}>
          Pricing
        </Divider>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={productData.purchasePrice}
            onChange={handleInputChange}
            fullWidth
            sx={{ backgroundColor: themeStyles.inputBackground }}
          />
          <TextField
            label="Sales Price"
            name="salesPrice"
            type="number"
            value={productData.salesPrice}
            onChange={handleInputChange}
            fullWidth
            sx={{ backgroundColor: themeStyles.inputBackground }}
          />
        </Stack>

        <Divider sx={{ my: 2, bgcolor: themeStyles.dividerColor }}>
          Stock
        </Divider>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Initial Stock"
            name="initialStock"
            type="number"
            value={productData.initialStock}
            onChange={handleInputChange}
            fullWidth
            sx={{ backgroundColor: themeStyles.inputBackground }}
          />
        </Stack>

        <Divider sx={{ my: 2, bgcolor: themeStyles.dividerColor }}>
          Description
        </Divider>
        <TextField
          label="Product Description"
          name="description"
          value={productData.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 3, backgroundColor: themeStyles.inputBackground }}
        />

        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              mb: 2,
              textAlign: "center",
              color: message.includes("Error") ? "red" : "green",
            }}
          >
            {message}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 48,
            fontSize: "1rem",
            backgroundColor: themeStyles.buttonBackground,
            "&:hover": {
              backgroundColor: themeStyles.buttonHover,
            },
          }}
        >
          {loading ? "Adding..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddProducts;
