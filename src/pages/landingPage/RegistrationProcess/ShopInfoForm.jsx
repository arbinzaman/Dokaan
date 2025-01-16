import { TextField } from "@mui/material";

const ShopInfoForm = ({ shopData, setShopData }) => {
  return (
    <>
      <TextField
        label="Shop Name"
        fullWidth
        margin="normal"
        value={shopData.dokaan_name}
        onChange={(e) => setShopData({ ...shopData, dokaan_name: e.target.value })}
      />
      <TextField
        label="Shop Location"
        fullWidth
        margin="normal"
        value={shopData.dokaan_location}
        onChange={(e) => setShopData({ ...shopData, dokaan_location: e.target.value })}
      />
      <TextField
        label="Shop Email"
        type="email"
        fullWidth
        margin="normal"
        value={shopData.dokaan_email}
        onChange={(e) => setShopData({ ...shopData, dokaan_email: e.target.value })}
      />
      <TextField
        label="Shop Phone"
        type="tel"
        fullWidth
        margin="normal"
        value={shopData.dokaan_phone}
        onChange={(e) => setShopData({ ...shopData, dokaan_phone: e.target.value })}
      />
      <TextField
        label="Shop Type"
        fullWidth
        margin="normal"
        value={shopData.dokaan_type}
        onChange={(e) => setShopData({ ...shopData, dokaan_type: e.target.value })}
      />
    </>
  );
};

export default ShopInfoForm;
