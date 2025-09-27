const express = require("express"); 

const PORT = process.env.PORT || 5000;
const app = express();

const cors = require("cors");
app.use(cors());

app.get("/aphrodite", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
