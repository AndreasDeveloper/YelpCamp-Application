// Importing Express Router
const express = require('express'),
      router = express.Router();

// ==================== \\
//    - INDEX ROUTE - 
// ==================== \\

// GET PAGE #1 | - Landing Page - \\
router.get('/', (req, res) => {
    res.render(`${__dirname}/../../html/landing.ejs`);
});

// Exporting Campgrounds Router
module.exports = router;