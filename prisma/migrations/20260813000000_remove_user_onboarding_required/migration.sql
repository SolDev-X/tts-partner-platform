-- The registration flow now collects the company name and password up front.
ALTER TABLE "User" DROP COLUMN "onboardingRequired";
