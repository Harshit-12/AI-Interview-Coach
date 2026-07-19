import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    generateCareerCoachReport,
    getCareerCoachReport
} from "../services/careerCoachService.js";

const router = express.Router();

/**
 * ----------------------------------------------------
 * Generate Career Coach Report
 * POST /api/career-coach/generate
 * ----------------------------------------------------
 */
router.post("/generate", protect, async (req, res) => {

    try {

        const report =
            await generateCareerCoachReport(
                req.user.userId
            );

        res.status(200).json({
            success: true,
            message:
                "Career Coach report generated successfully.",
            report
        });

    } catch (error) {

        console.error(
            "Career Coach Generation Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to generate Career Coach report.",

            error: error.message

        });

    }

});

/**
 * ----------------------------------------------------
 * Get Saved Career Coach Report
 * GET /api/career-coach
 * ----------------------------------------------------
 */
router.get("/", protect, async (req, res) => {

    try {

        const report =
            await getCareerCoachReport(
                req.user.userId
            );

        if (!report) {

            return res.status(404).json({

                success: false,

                message:
                    "Career Coach report not found. Generate it first."

            });

        }

        res.status(200).json({

            success: true,

            report

        });

    }

    catch (error) {

        console.error(
            "Career Coach Fetch Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch Career Coach report.",

            error: error.message

        });

    }

});

export default router;