import { Request, Response } from "express";
import { CMSContent } from "./cms.model";
import { successResponse, errorResponse } from "../../common/response";

export const getCMSContent = async (req: Request, res: Response) => {
  try {
    let content = await CMSContent.findOne();
    if (!content) {
      content = await CMSContent.create({});
    }
    return successResponse(res, content, 200, "CMS content retrieved successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to fetch CMS content", 500);
  }
};

export const updateCMSContent = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let content = await CMSContent.findOne();
    
    if (!content) {
      content = await CMSContent.create(updateData);
    } else {
      if (updateData.hero) content.hero = { ...content.hero, ...updateData.hero };
      if (updateData.pricing) content.pricing = { ...content.pricing, ...updateData.pricing };
      if (updateData.siteSettings) content.siteSettings = { ...content.siteSettings, ...updateData.siteSettings };
      if (updateData.rulesAndDisclaimer) {
        content.rulesAndDisclaimer = { ...content.rulesAndDisclaimer, ...updateData.rulesAndDisclaimer };
      }
      if (updateData.faqs && Array.isArray(updateData.faqs)) {
        content.faqs = updateData.faqs;
      }
      if (updateData.packages && Array.isArray(updateData.packages)) {
        content.packages = updateData.packages;
      }
      if (updateData.testimonials && Array.isArray(updateData.testimonials)) {
        content.testimonials = updateData.testimonials;
      }
      await content.save();
    }

    return successResponse(res, content, 200, "CMS content updated successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to update CMS content", 500);
  }
};
