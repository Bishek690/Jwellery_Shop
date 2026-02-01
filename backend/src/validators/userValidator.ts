import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entity/User";

const isEmail = (email?: string) => typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Enhanced international phone validation including Nepal and all nations
const isPhone = (phone?: string): boolean => {
  if (!phone || typeof phone !== "string") return false;
  
  // Remove all spaces, dashes, parentheses, dots, and normalize
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, "");
  
  // Check for valid international phone format
  const internationalPatterns = [
    // Standard international format: +[country code][number]
    /^\+[1-9]\d{6,14}$/,
    // Alternative format with 00 prefix: 00[country code][number]  
    /^00[1-9]\d{6,14}$/,
    // Direct format without + (but with country code)
    /^[1-9]\d{7,14}$/
  ];
  
  // Check if it matches any international pattern
  if (!internationalPatterns.some(pattern => pattern.test(cleanPhone))) {
    return false;
  }
  
  // Extract digits only for length validation
  const digitsOnly = cleanPhone.replace(/[^\d]/g, "");
  
  // ITU-T E.164 standard: 7-15 digits total (including country code)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return false;
  }
  
  // Specific country validations including Nepal and major countries
  const countryPatterns = [
    // Nepal: +977 (9 or 10 digits total)
    /^(\+977|00977|977)[1-9]\d{7,8}$/,
    
    // Major countries
    /^(\+1|001|1)[2-9]\d{2}[2-9]\d{6}$/,          // US/Canada
    /^(\+44|0044|44)[1-9]\d{8,9}$/,                // UK
    /^(\+91|0091|91)[6-9]\d{9}$/,                  // India
    /^(\+49|0049|49)[1-9]\d{10,11}$/,              // Germany
    /^(\+33|0033|33)[1-9]\d{8}$/,                  // France
    /^(\+86|0086|86)1[3-9]\d{9}$/,                 // China
    /^(\+81|0081|81)[7-9]\d{9}$/,                  // Japan
    /^(\+61|0061|61)[2-478]\d{8}$/,                // Australia
    /^(\+55|0055|55)[1-9]{2}9?\d{8}$/,             // Brazil
    /^(\+7|007|7)[4-9]\d{9}$/,                     // Russia/Kazakhstan
    
    // South Asian countries
    /^(\+92|0092|92)[3-9]\d{8,9}$/,                // Pakistan
    /^(\+880|00880|880)[1-9]\d{8,9}$/,             // Bangladesh
    /^(\+94|0094|94)[1-9]\d{8}$/,                  // Sri Lanka
    /^(\+975|00975|975)[1-9]\d{7}$/,               // Bhutan
    /^(\+960|00960|960)[7-9]\d{6}$/,               // Maldives
    
    // Southeast Asian countries
    /^(\+66|0066|66)[6-9]\d{8}$/,                  // Thailand
    /^(\+84|0084|84)[3-9]\d{8,9}$/,                // Vietnam
    /^(\+62|0062|62)[8-9]\d{7,11}$/,               // Indonesia
    /^(\+60|0060|60)[1-9]\d{7,9}$/,                // Malaysia
    /^(\+63|0063|63)[9]\d{9}$/,                    // Philippines
    /^(\+65|0065|65)[6-9]\d{7}$/,                  // Singapore
    
    // Middle Eastern countries
    /^(\+971|00971|971)[5-9]\d{8}$/,               // UAE
    /^(\+966|00966|966)[5-9]\d{8}$/,               // Saudi Arabia
    /^(\+90|0090|90)[5-9]\d{9}$/,                  // Turkey
    /^(\+98|0098|98)[9]\d{9}$/,                    // Iran
    
    // African countries
    /^(\+27|0027|27)[6-8]\d{8}$/,                  // South Africa
    /^(\+234|00234|234)[7-9]\d{9}$/,               // Nigeria
    /^(\+20|0020|20)[1-9]\d{8,9}$/,                // Egypt
    
    // European countries
    /^(\+39|0039|39)[3]\d{8,9}$/,                  // Italy
    /^(\+34|0034|34)[6-9]\d{8}$/,                  // Spain
    /^(\+31|0031|31)[6]\d{8}$/,                    // Netherlands
    /^(\+46|0046|46)[7]\d{8}$/,                    // Sweden
    /^(\+47|0047|47)[4-9]\d{7}$/,                  // Norway
    
    // General fallback for any other country (E.164 compliant)
    /^(\+|00)?[1-9]\d{6,14}$/
  ];
  
  // Test against all country patterns
  return countryPatterns.some(pattern => pattern.test(cleanPhone));
};

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, password, role } = req.body;
  
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    return res.status(400).json({ 
      message: "Name is required and must be at least 3 characters",
      field: "name"
    });
  }
  
  if (!isEmail(email)) {
    return res.status(400).json({ 
      message: "Valid email is required",
      field: "email" 
    });
  }
  
  if (!isPhone(phone)) {
    return res.status(400).json({ 
      message: "Valid international phone number is required with country code",
      field: "phone",
      examples: {
        nepal: "+977 98XXXXXXXX, +977 14XXXXXXX",
        usa: "+1 555 123 4567",
        uk: "+44 20 1234 5678", 
        india: "+91 98765 43210",
        china: "+86 138 0013 8000",
        germany: "+49 30 12345678",
        australia: "+61 2 1234 5678"
      },
      note: "Include country code with + or 00 prefix. Spaces and dashes are optional."
    });
  }
  
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ 
      message: "Password is required and must be at least 6 characters",
      field: "password"
    });
  }
  
  // Prevent clients from setting privileged roles via public API
  if (role && role !== UserRole.CUSTOMER) {
    return res.status(403).json({ 
      message: "Cannot assign role via public signup. Only customer registration allowed.",
      field: "role"
    });
  }
  
  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, password, role } = req.body;
  
  if (name && (typeof name !== "string" || name.trim().length < 3)) {
    return res.status(400).json({ 
      message: "Name must be at least 3 characters",
      field: "name"
    });
  }
  
  if (email && !isEmail(email)) {
    return res.status(400).json({ 
      message: "Email format is invalid",
      field: "email"
    });
  }
  
  if (phone && !isPhone(phone)) {
    return res.status(400).json({ 
      message: "Invalid international phone number format",
      field: "phone",
      examples: {
        nepal: "+977 98XXXXXXXX, +977 14XXXXXXX",
        usa: "+1 555 123 4567",
        uk: "+44 20 1234 5678", 
        india: "+91 98765 43210"
      }
    });
  }
  
  if (password && (typeof password !== "string" || password.length < 6)) {
    return res.status(400).json({ 
      message: "Password must be at least 6 characters",
      field: "password"
    });
  }
  
  if (role && !Object.values(UserRole).includes(role)) {
    return res.status(400).json({ 
      message: `Role must be one of: ${Object.values(UserRole).join(", ")}`,
      field: "role"
    });
  }
  
  next();
};

// Export enhanced phone validator for use in other modules
export { isPhone as isInternationalPhone };
