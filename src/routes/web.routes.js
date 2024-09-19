import express from 'express';

const router = express.Router();


router.get("/", async (req, res) => {
    return res.render("pages/home.ejs");
})

router.get("/api/changelog", async (req, res) => {
    return res.render("api/changelog");
})

router.get("/forgetPassword", async (req, res) => {
    return res.render("pages/forgetPassword.ejs")
})
export default router;



