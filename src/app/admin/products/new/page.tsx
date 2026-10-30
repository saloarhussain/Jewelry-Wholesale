"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, CATEGORIES, JewelryCategory } from "@/data/products";
import { useProducts } from "@/components/ProductContext";
import { useAuth } from "@/components/AuthContext";
import { uploadProductImage } from "@/lib/supabaseStorage";
import {
  Upload,
  Trash2,
  CheckCircle2,
  Loader2,
  Star,
  Plus,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Search,
  Layers,
  Sliders,
  Eye,
  RefreshCw,
  AlertCircle,
  Tag,
  ShoppingBag,
  Globe,
  Award,
} from "lucide-react";

// Curated high-res jewelry photography presets for instant 1-click selection
const IMAGE_PRESETS = [
  {
    name: "Solitaire Pavé Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Classic Signet Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Emerald Cut Solitaire Pendant",
    category: "Pendants",
    url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Vintage Heart Locket",
    category: "Pendants",
    url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tennis Diamond Bracelet",
    category: "Bracelets",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Paperclip Link Bracelet",
    category: "Bracelets",
    url: "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Layered Princess Necklace",
    category: "Necklaces",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Hinged Sterling Silver Bangle",
    category: "Bangles",
    url: "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Luxury Huggie Hoops",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pavé Crystal Studs",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Diamond-Cut Curb Chain",
    category: "Chains",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Delicate Charm Anklet",
    category: "Anklets",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
];

// Amazon / Flipkart Style Jewelry Types & Taxonomy
interface JewelryTypeDefinition {
  id: string;
  category: JewelryCategory;
  title: string;
  icon: string;
  tagline: string;
  popularSubtypes: string[];
  specHighlights: string[];
  defaultFinish: string;
  defaultPurity: string;
  typicalWeightRange: string;
}

const JEWELRY_TYPES: JewelryTypeDefinition[] = [
  {
    id: "ring",
    category: "Rings",
    title: "Rings",
    icon: "💍",
    tagline: "Bands, solitaires, cocktail, promise rings & eternity designs with finger sizing specs.",
    popularSubtypes: ["Solitaire", "Band", "Eternity", "Cocktail", "Halo", "Signet", "Adjustable / Free-Size", "Three-Stone"],
    specHighlights: ["Ring Sizes (US 5-12 / UK J-T)", "Band Width (mm)", "Prong / Bezel Setting", "Sizing Type"],
    defaultFinish: "Anti-Tarnish Rhodium Plating",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "2.2g - 5.5g",
  },
  {
    id: "pendant",
    category: "Pendants",
    title: "Pendants & Lockets",
    icon: "📿",
    tagline: "Drop pendants, lockets, and medallions with bail inner clearance for chain pass-through.",
    popularSubtypes: ["Solitaire Pendant", "Medallion", "Charm", "Religious / Spiritual", "Locket", "Teardrop", "Geometric"],
    specHighlights: ["Bail Inner Opening (mm)", "Pendant Dimensions (H×W)", "Chain Inclusion Option", "Locket Closure"],
    defaultFinish: "High-Polish Rhodium Barrier",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "1.8g - 6.5g",
  },
  {
    id: "bracelet",
    category: "Bracelets",
    title: "Bracelets",
    icon: "🔗",
    tagline: "Tennis bracelets, chain link, charm & bolo slider wristwear with security clasps.",
    popularSubtypes: ["Tennis Bracelet", "Link & Chain", "Charm Bracelet", "Bolo / Slider", "Cuff Bracelet", "Paperclip"],
    specHighlights: ["Wrist Length (6.5\" - 8\")", "Clasp Type & Safety Catch", "Link Style", "Extender Chain"],
    defaultFinish: "Rhodium Plated Anti-Tarnish",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "5.0g - 18.0g",
  },
  {
    id: "necklace",
    category: "Necklaces",
    title: "Necklaces",
    icon: "✨",
    tagline: "Chokers, collar lengths, princess drops, and layered necklaces with clasp mechanisms.",
    popularSubtypes: ["Choker (14\")", "Collar (16\")", "Princess (18\")", "Matinee (20\")", "Lariat / Y-Drop", "Layered"],
    specHighlights: ["Necklace Length", "Clasp Type", "Chain Weave Style", "Drop Dimension"],
    defaultFinish: "Diamond-Cut Mirror Rhodium",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "4.5g - 25.0g",
  },
  {
    id: "bangle",
    category: "Bangles",
    title: "Bangles & Kadas",
    icon: "⭕",
    tagline: "Rigid bangles, hinged wrist cuffs, and traditional kadas with inner diameter sizing.",
    popularSubtypes: ["Hinged with Safety Clasp", "Screw Kada", "Open Cuff Bangle", "Solid Slip-On", "Adjustable"],
    specHighlights: ["Bangle Size (2.2 - 2.8)", "Inner Diameter (mm)", "Closure Mechanism", "Wall Thickness"],
    defaultFinish: "High Mirror Polish / Antique",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "12.0g - 45.0g",
  },
  {
    id: "earring",
    category: "Earrings",
    title: "Earrings",
    icon: "💎",
    tagline: "Studs, huggie hoops, leverbacks, and chandelier drops with specialized backings.",
    popularSubtypes: ["Studs", "Huggies", "Classic Hoops", "Drop & Dangle", "Ear Climbers", "Chandbali"],
    specHighlights: ["Fastening Backing Type", "Drop Length (mm)", "Hoop Outer Diameter", "Weight per Pair"],
    defaultFinish: "Hypoallergenic Rhodium Seal",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "1.5g - 8.0g",
  },
  {
    id: "chain",
    category: "Chains",
    title: "Chains",
    icon: "⛓️",
    tagline: "Standalone precious metal chain weaves (Curb, Figaro, Rope, Franco, Box, Snake).",
    popularSubtypes: ["Curb", "Figaro", "Rope", "Franco", "Box", "Snake", "Byzantine", "Cuban"],
    specHighlights: ["Gauge / Width (mm)", "Length (16\" - 30\")", "Weave Geometry", "Lobster / Spring Clasp"],
    defaultFinish: "Diamond-Cut Liquid Silver",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "3.5g - 35.0g",
  },
  {
    id: "anklet",
    category: "Anklets",
    title: "Anklets (Payal)",
    icon: "🧦",
    tagline: "Delicate ankle chains, charm payals, and tennis anklets with comfort extenders.",
    popularSubtypes: ["Delicate Chain Anklet", "Charm Payal", "Figaro Anklet", "Tennis Anklet", "Bells / Ghungroo"],
    specHighlights: ["Length (9\" - 11\")", "Extender Chain (cm)", "Clasp Security", "Accent Charms"],
    defaultFinish: "Protective E-Coating Anti-Tarnish",
    defaultPurity: "Solid 925 Sterling Silver",
    typicalWeightRange: "2.8g - 9.5g",
  },
];

function NewProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { products, addProduct, updateProduct, getProductById } = useProducts();
  const { user } = useAuth();

  const isEditing = Boolean(editId);

  // Stepper State: Step 1 (Type Taxonomy) vs Step 2 (Details & SEO)
  const [currentStep, setCurrentStep] = useState<1 | 2>(isEditing ? 2 : 1);
  const [taxonomySearch, setTaxonomySearch] = useState("");

  // Helper to generate a new unique SKU
  const generateNewSku = (category: string) => {
    const prefix = category.slice(0, 3).toUpperCase();
    const randNum = Math.floor(100 + Math.random() * 900);
    return `AG-${prefix}-${randNum}`;
  };

  // Base Form Fields State
  const [formCategory, setFormCategory] = useState<JewelryCategory>("Rings");
  const [formSubType, setFormSubType] = useState<string>("");
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState(generateNewSku("Rings"));
  const [formBadge, setFormBadge] = useState<string>("");
  const [formShortDescription, setFormShortDescription] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPurity, setFormPurity] = useState("");
  const [formGramWeight, setFormGramWeight] = useState("");
  const [formFinish, setFormFinish] = useState("");
  const [formDimensions, setFormDimensions] = useState("");
  const [formHallmarked, setFormHallmarked] = useState(true);

  // Commercial Wholesale Pricing & Inventory
  const [formPriceGBP, setFormPriceGBP] = useState<number | "">("");
  const [formPriceUSD, setFormPriceUSD] = useState<number | "">("");
  const [formSuggestedRetailGBP, setFormSuggestedRetailGBP] = useState<number | "">("");
  const [formSuggestedRetailUSD, setFormSuggestedRetailUSD] = useState<number | "">("");
  const [formMoq, setFormMoq] = useState<number | "">("");
  const [formStockCount, setFormStockCount] = useState<number | "">("");

  // Media & Photos
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Private Supplier Details (Strictly Internal Admin Only - No SEO)
  const [formSupplierName, setFormSupplierName] = useState("");
  const [formSupplierProductCode, setFormSupplierProductCode] = useState("");
  const [formSupplierProductLink, setFormSupplierProductLink] = useState("");
  const [formSupplierPrice, setFormSupplierPrice] = useState<number | "">("");

  // Amazon / Flipkart Style Type-Specific Details
  // Rings
  const [formRingSizes, setFormRingSizes] = useState<string[]>([]);
  const [formBandWidth, setFormBandWidth] = useState("");
  const [formSettingType, setFormSettingType] = useState("");
  const [formRingSizingType, setFormRingSizingType] = useState("");

  // Pendants
  const [formPendantHeight, setFormPendantHeight] = useState("");
  const [formPendantWidth, setFormPendantWidth] = useState("");
  const [formBailOpening, setFormBailOpening] = useState("");
  const [formChainInclusion, setFormChainInclusion] = useState("");

  // Bracelets
  const [formBraceletLength, setFormBraceletLength] = useState("");
  const [formClaspType, setFormClaspType] = useState("");
  const [formLinkStyle, setFormLinkStyle] = useState("");

  // Necklaces
  const [formNecklaceLength, setFormNecklaceLength] = useState("");
  const [formChainType, setFormChainType] = useState("");

  // Bangles
  const [formBangleSize, setFormBangleSize] = useState("");
  const [formClosureType, setFormClosureType] = useState("");
  const [formBangleWidth, setFormBangleWidth] = useState("");

  // Earrings
  const [formEarringBacking, setFormEarringBacking] = useState("");
  const [formEarringDrop, setFormEarringDrop] = useState("");

  // Chains
  const [formChainWeave, setFormChainWeave] = useState("");
  const [formChainGauge, setFormChainGauge] = useState("");

  // Gemstone Details (Amazon / Flipkart Jewelry Specs)
  const [formGemstoneType, setFormGemstoneType] = useState("");
  const [formStoneCut, setFormStoneCut] = useState("");
  const [formCaratWeight, setFormCaratWeight] = useState("");
  const [formStoneColor, setFormStoneColor] = useState("");
  const [formStoneCount, setFormStoneCount] = useState<number | "">("");

  // SEO & Marketplace Listing Studio Fields
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formKeyBullets, setFormKeyBullets] = useState<string[]>([]);
  const [formMetaDescription, setFormMetaDescription] = useState("");
  const [formSeoKeywords, setFormSeoKeywords] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seoNotification, setSeoNotification] = useState("");

  // Populate data when editing
  useEffect(() => {
    if (editId) {
      const existing = getProductById(editId);
      if (existing) {
        setFormName(existing.name);
        setFormSlug(existing.slug);
        setFormSku(existing.sku);
        setFormCategory(existing.category as JewelryCategory);
        setFormSubType(existing.subType || "Solitaire");
        setFormBadge(existing.badge || "");
        setFormPurity(existing.purity);
        setFormGramWeight(existing.gramWeight);
        setFormFinish(existing.finish);
        setFormDimensions(existing.dimensions);
        setFormHallmarked(existing.hallmarked);
        setFormPriceGBP(existing.priceGBP);
        setFormPriceUSD(existing.priceUSD);
        setFormSuggestedRetailGBP(existing.suggestedRetailGBP);
        setFormSuggestedRetailUSD(existing.suggestedRetailUSD);
        setFormMoq(existing.moq);
        setFormStockCount(existing.stockCount);
        if (existing.images && existing.images.length > 0) {
          setProductImages(existing.images);
        } else {
          setProductImages([]);
        }
        setFormShortDescription(existing.shortDescription);
        setFormDescription(existing.description);
        setFormSeoKeywords(existing.seoKeywords ? existing.seoKeywords.join(", ") : "");
        setFormSupplierName(existing.supplierName || "");
        setFormSupplierProductCode(existing.supplierProductCode || "");
        setFormSupplierProductLink(existing.supplierProductLink || "");
        setFormSupplierPrice(existing.supplierPrice != null ? existing.supplierPrice : "");

        // Type specs
        if (existing.gemstoneType) setFormGemstoneType(existing.gemstoneType);
        if (existing.stoneCut) setFormStoneCut(existing.stoneCut);
        if (existing.caratWeight) setFormCaratWeight(existing.caratWeight);
        if (existing.stoneColor) setFormStoneColor(existing.stoneColor);
        if (existing.stoneCount != null) setFormStoneCount(existing.stoneCount);
        if (existing.settingType) setFormSettingType(existing.settingType);
        if (existing.claspType) setFormClaspType(existing.claspType);
        if (existing.ringSize) setFormRingSizes(existing.ringSize.split(",").map((s) => s.trim()));
        if (existing.bangleSize) setFormBangleSize(existing.bangleSize);
        if (existing.closureType) setFormClosureType(existing.closureType);
        if (existing.bailOpening) setFormBailOpening(existing.bailOpening);
        if (existing.earringBacking) setFormEarringBacking(existing.earringBacking);
        if (existing.bulletPoints && existing.bulletPoints.length > 0) setFormKeyBullets(existing.bulletPoints);
        if (existing.metaTitle) setFormSeoTitle(existing.metaTitle);
        if (existing.metaDescription) setFormMetaDescription(existing.metaDescription);
      }
    }
  }, [editId, getProductById]);

  // Selected Type definition
  const currentTypeDef = useMemo(() => {
    return JEWELRY_TYPES.find((t) => t.category === formCategory) || JEWELRY_TYPES[0];
  }, [formCategory]);

  // Handle Category selection from Step 1
  const handleSelectJewelryType = (typeDef: JewelryTypeDefinition) => {
    setFormCategory(typeDef.category);
    setFormSubType("");
    if (!isEditing) {
      setFormSku(generateNewSku(typeDef.category));
    }
  };

  // Price GBP auto sync
  const handlePriceGBPChange = (val: number | "") => {
    setFormPriceGBP(val);
    if (val === "" || val === 0 || isNaN(val)) {
      setFormPriceUSD("");
      setFormSuggestedRetailGBP("");
      setFormSuggestedRetailUSD("");
      return;
    }
    const usd = Number((val * 1.3).toFixed(2));
    setFormPriceUSD(usd);
    const msrpGBP = Number((val * 3.2).toFixed(2));
    setFormSuggestedRetailGBP(msrpGBP);
    const msrpUSD = Number((usd * 3.2).toFixed(2));
    setFormSuggestedRetailUSD(msrpUSD);
  };

  // 1-Click AI / Algorithmic SEO Listing Generator
  const handleAutoGenerateSEO = () => {
    const purityPrefix = formPurity.trim() || "Solid 925 Sterling Silver";
    const defaultFinishVal = currentTypeDef.defaultFinish || "Anti-Tarnish Rhodium Plating";
    if (!formPurity.trim()) setFormPurity("Solid 925 Sterling Silver");
    if (!formFinish.trim()) setFormFinish(defaultFinishVal);

    const stoneDescriptor =
      formGemstoneType && formGemstoneType !== "Plain Solid Silver (No Stone)"
        ? `${formStoneCut ? formStoneCut + " " : ""}${formGemstoneType.replace(/\s*\(.*?\)\s*/g, "")}`
        : "";
    const styleDescriptor = formSubType && formSubType !== "Standard" ? formSubType : "";
    const finishDescriptor = (formFinish.trim() || defaultFinishVal).replace(/Anti-Tarnish|Plated/gi, "").trim() || "Rhodium";
    const categorySingular =
      formCategory === "Rings"
        ? "Ring"
        : formCategory === "Pendants"
        ? "Pendant"
        : formCategory === "Bracelets"
        ? "Bracelet"
        : formCategory === "Necklaces"
        ? "Necklace"
        : formCategory === "Bangles"
        ? "Bangle"
        : formCategory === "Earrings"
        ? "Earrings"
        : formCategory === "Chains"
        ? "Chain"
        : "Anklet";

    // 1. Algorithmic Title (Flipkart & Amazon Formula)
    const generatedTitle = [
      purityPrefix,
      stoneDescriptor,
      styleDescriptor,
      categorySingular,
      "with",
      finishDescriptor,
      "Plating (Hallmarked)",
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    setFormName(generatedTitle);
    setFormSeoTitle(`${generatedTitle} | Wholesale Trade`);

    // 2. Clean URL Slug
    const generatedSlug = generatedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormSlug(generatedSlug);

    // 3. Dynamic Technical Dimensions formatting
    let dynamicDimensions = "";
    if (formCategory === "Rings") {
      dynamicDimensions = `Band Width: ${formBandWidth || "2.2mm"} | Sizing: ${formRingSizes.join(", ") || "US 6, 7, 8"} | Setting: ${formSettingType || "4-Prong Setting"}`;
    } else if (formCategory === "Pendants") {
      dynamicDimensions = `Pendant Drop: ${formPendantHeight || "18mm"} × ${formPendantWidth || "12mm"} | Bail Opening: ${formBailOpening || "4.2mm"} | ${formChainInclusion || "Pendant Only"}`;
    } else if (formCategory === "Bracelets") {
      dynamicDimensions = `Wrist Length: ${formBraceletLength || "7.25\" (18.5cm)"} | Clasp: ${formClaspType || "Box Clasp with Dual Safety Latches"} | Style: ${formLinkStyle || "Tennis Diamond-Set Links"}`;
    } else if (formCategory === "Necklaces") {
      dynamicDimensions = `Drop Length: ${formNecklaceLength || "18 inches (Princess Length)"} | Clasp: ${formClaspType || "Lobster Claw"} | Weave: ${formChainType || "Cable Link"}`;
    } else if (formCategory === "Bangles") {
      dynamicDimensions = `Bangle Size: ${formBangleSize || "2.4 (57.2mm)"} | Fastener: ${formClosureType || "Hinged with Hidden Safety Lock"} | Profile: ${formBangleWidth || "4.5mm"}`;
    } else if (formCategory === "Earrings") {
      dynamicDimensions = `Backing: ${formEarringBacking || "Push Back"} | Drop: ${formEarringDrop || "12mm"}`;
    } else if (formCategory === "Chains") {
      dynamicDimensions = `Weave: ${formChainWeave || "Diamond-Cut Curb"} | Gauge: ${formChainGauge || "3.0mm"} | Clasp: Lobster Claw`;
    } else {
      dynamicDimensions = `Length: 9" + 1" Extender | Clasp: Lobster Claw`;
    }
    setFormDimensions(dynamicDimensions);

    // 4. Amazon 5 Key Feature Bullets ("About this item")
    const bullets = [
      `💎 CERTIFIED SOLID 925 STERLING SILVER: Authenticated genuine 925 sterling silver hallmarked in compliance with UK Assay and US FTC jewelry standards. 100% hypoallergenic, nickel-free, and lead-free for sensitive skin.`,
      `✨ OPTICAL FIRE & STONE SETTING: Features hand-set ${formStoneCut || "Round Brilliant"} ${formGemstoneType || "AAA+ Cubic Zirconia"} mounted securely in ${formSettingType || "master prongs"}, delivering diamond-caliber refraction and lasting durability.`,
      `📐 PRECISION FIT & MEASUREMENTS: ${dynamicDimensions}. Calibrated for luxurious daily comfort, smooth contour edges, and boutique showroom presentation.`,
      `🛡️ ANTI-TARNISH PROTECTIVE FINISH: Treated with a multi-layer ${formFinish || "liquid-bright Rhodium and E-coating"} to preserve deep mirror shine and protect against surface scratches, oxidation, and humidity.`,
      `📦 WHOLESALE B2B ADVANTAGE: Factory-direct wholesale pricing starting at opening MOQ ${formMoq || 3} pcs. High retail margin potential (65%+ markup) for boutique retailers, gift shops, and online merchants.`,
    ];
    setFormKeyBullets(bullets);

    // 5. Short Description
    const shortDesc = `Solid 925 sterling silver ${styleDescriptor.toLowerCase()} ${categorySingular.toLowerCase()} featuring ${stoneDescriptor ? stoneDescriptor.toLowerCase() + " and " : ""}${finishDescriptor.toLowerCase()} protective plating. UK assay hallmarked for verified fineness.`;
    setFormShortDescription(shortDesc);

    // 6. Full Description with Bullet Points
    const fullDesc = `${shortDesc}\n\nKey Wholesale Specifications:\n${bullets.map((b) => `• ${b}`).join("\n")}\n\nDesigned specifically for commercial jewelry retailers and trade stockists seeking certified sterling silver craftsmanship.`;
    setFormDescription(fullDesc);

    // 7. SEO Meta Description (150-160 characters)
    const metaDesc = `Wholesale 925 sterling silver ${categorySingular.toLowerCase()} with ${finishDescriptor.toLowerCase()} finish and ${stoneDescriptor || "fine craftsmanship"}. Assay hallmarked, low MOQ ${formMoq || 3} pcs, fast UK/US delivery.`;
    setFormMetaDescription(metaDesc.slice(0, 160));

    // 8. High-Intent Backend Search Keywords
    const keywordList = [
      `wholesale 925 silver ${categorySingular.toLowerCase()}`,
      `bulk sterling silver ${categorySingular.toLowerCase()}`,
      `solid silver ${styleDescriptor.toLowerCase()} ${categorySingular.toLowerCase()}`,
      `UK hallmarked silver ${categorySingular.toLowerCase()}`,
      `rhodium plated ${categorySingular.toLowerCase()}`,
      `boutique jewelry supplies`,
      `b2b silver jewelry distributor`,
      `hypoallergenic silver ${categorySingular.toLowerCase()}`,
      `${stoneDescriptor ? stoneDescriptor.toLowerCase() + " silver " + categorySingular.toLowerCase() : "plain 925 silver"}`,
      `high margin retail jewelry`,
    ]
      .filter(Boolean)
      .join(", ");
    setFormSeoKeywords(keywordList);

    setSeoNotification("✨ All SEO titles, bullets, slugs & keywords successfully generated!");
    setTimeout(() => setSeoNotification(""), 4000);
  };

  // Handle file uploads to Supabase Storage
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError("");

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload valid image files (JPG, PNG, WEBP, AVIF).");
        continue;
      }
      try {
        const url = await uploadProductImage(file);
        if (url) {
          newUrls.push(url);
        }
      } catch (err: any) {
        setUploadError(`Failed to upload ${file.name}: ${err.message || "error"}`);
      }
    }

    if (newUrls.length > 0) {
      setProductImages((prev) => [...prev, ...newUrls]);
    }
    setIsUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    setProductImages((prev) => {
      const target = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [target, ...rest];
    });
  };

  const handleAddPreset = (url: string) => {
    if (!productImages.includes(url)) {
      setProductImages((prev) => [...prev, url]);
    }
  };

  // SEO Score Calculator
  const seoScore = useMemo(() => {
    let score = 0;
    if (formName.length >= 35 && formName.length <= 90) score += 20;
    else if (formName.length > 0) score += 10;

    if (formSlug.length > 0) score += 10;
    if (formKeyBullets.length >= 4) score += 20;
    if (formMetaDescription.length >= 100 && formMetaDescription.length <= 165) score += 15;
    else if (formMetaDescription.length > 0) score += 8;

    if (formSeoKeywords.split(",").filter((k) => k.trim()).length >= 5) score += 15;
    if (formGramWeight.trim().length > 0) score += 10;
    if (productImages.length > 0) score += 10;

    return Math.min(100, score);
  }, [formName, formSlug, formKeyBullets, formMetaDescription, formSeoKeywords, formGramWeight, productImages]);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formName.trim()) {
      alert("Please provide a product title.");
      setIsSubmitting(false);
      return;
    }
    if (!formSku.trim()) {
      alert("Please provide a valid SKU.");
      setIsSubmitting(false);
      return;
    }

    const imagesArray = productImages.filter((u) => Boolean(u && u.trim()));
    if (imagesArray.length === 0) {
      alert("Please upload or select at least one product photo.");
      setIsSubmitting(false);
      return;
    }

    if (formPriceGBP === "" || Number(formPriceGBP) <= 0) {
      alert("Please provide a valid wholesale price (GBP).");
      setIsSubmitting(false);
      return;
    }

    const keywordsArray = formSeoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const slug =
      formSlug.trim() ||
      formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const parsedMoq = Number(formMoq) > 0 ? Number(formMoq) : 1;
    const finalPurity = formPurity.trim() || "Solid 925 Sterling Silver";

    const tierPricing = [
      { minQuantity: parsedMoq, discountPercentage: 0 },
      { minQuantity: Math.max(15, parsedMoq * 2), discountPercentage: 8 },
      { minQuantity: Math.max(50, parsedMoq * 5), discountPercentage: 15 },
      { minQuantity: Math.max(100, parsedMoq * 10), discountPercentage: 22 },
    ];

    const payload: Partial<Product> = {
      name: formName.trim(),
      slug,
      sku: formSku.trim(),
      category: formCategory,
      badge: formBadge || undefined,
      purity: finalPurity,
      gramWeight: formGramWeight.trim(),
      finish: formFinish.trim(),
      dimensions: formDimensions.trim(),
      hallmarked: formHallmarked,
      priceGBP: Number(formPriceGBP) || 0,
      priceUSD: Number(formPriceUSD) || 0,
      suggestedRetailGBP: Number(formSuggestedRetailGBP) || 0,
      suggestedRetailUSD: Number(formSuggestedRetailUSD) || 0,
      moq: parsedMoq,
      stockCount: Number(formStockCount) || 0,
      images: imagesArray,
      shortDescription: formShortDescription.trim(),
      description: formDescription.trim(),
      seoKeywords: keywordsArray,
      supplierName: formSupplierName.trim() || undefined,
      supplierProductCode: formSupplierProductCode.trim() || undefined,
      supplierProductLink: formSupplierProductLink.trim() || undefined,
      supplierPrice: formSupplierPrice !== "" ? Number(formSupplierPrice) : undefined,
      // Flipkart / Amazon Specifications
      jewelryType: formCategory,
      subType: formSubType.trim() || undefined,
      gemstoneType: formGemstoneType || undefined,
      stoneCut: formStoneCut || undefined,
      stoneColor: formStoneColor || undefined,
      stoneCount: typeof formStoneCount === "number" ? formStoneCount : undefined,
      caratWeight: formCaratWeight || undefined,
      settingType: formSettingType || undefined,
      claspType: formClaspType || undefined,
      chainType: formChainType || undefined,
      chainLength: formNecklaceLength || undefined,
      ringSize: formRingSizes.join(", ") || undefined,
      bangleSize: formBangleSize || undefined,
      closureType: formClosureType || undefined,
      bailOpening: formBailOpening || undefined,
      earringBacking: formEarringBacking || undefined,
      bulletPoints: formKeyBullets,
      metaTitle: formSeoTitle.trim() || undefined,
      metaDescription: formMetaDescription.trim() || undefined,
    };

    if (isEditing && editId) {
      await updateProduct(editId, payload);
    } else {
      const newProduct: Product = {
        ...(payload as any),
        id: `slv-${Date.now().toString().slice(-6)}`,
        rating: 5.0,
        reviewsCount: 1,
        tierPricing,
      };
      await addProduct(newProduct);
    }

    router.push("/admin?tab=catalog&status=saved");
  };

  // Real-time margins
  const pGbp = typeof formPriceGBP === "number" ? formPriceGBP : 0;
  const sGbp = typeof formSuggestedRetailGBP === "number" ? formSuggestedRetailGBP : 0;
  const profitGBP = pGbp > 0 && sGbp >= pGbp ? Number((sGbp - pGbp).toFixed(2)) : 0;
  const markupPercent = pGbp > 0 ? Math.round((profitGBP / pGbp) * 100) : 0;
  const keystoneMultiple = pGbp > 0 ? (sGbp / pGbp).toFixed(1) : "0.0";

  // Filtered jewelry types for Step 1 search
  const filteredJewelryTypes = useMemo(() => {
    if (!taxonomySearch.trim()) return JEWELRY_TYPES;
    const q = taxonomySearch.toLowerCase();
    return JEWELRY_TYPES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.popularSubtypes.some((s) => s.toLowerCase().includes(q))
    );
  }, [taxonomySearch]);

  // Protect Admin Access
  if (!user || user.role !== "admin") {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center mx-auto text-2xl shadow-xs">
            👑
          </div>
          <h2 className="text-xl font-bold text-slate-950">Administrator Access Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Product listing creation and wholesale line-sheet editing is restricted to authorized administrative personnel.
          </p>
          <div className="pt-2 space-y-2">
            <Link
              href="/account/login?redirect=/admin/products/new"
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg block transition shadow-sm"
            >
              Sign In as Administrator &rarr;
            </Link>
            <Link
              href="/"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-lg block transition"
            >
              Return to Wholesale Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-4 sm:py-8 lg:py-10 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-slate-200 gap-3 sm:gap-4">
          <div>
            <nav className="text-[11px] sm:text-xs text-slate-500 mb-1.5 flex flex-wrap items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
              <span>/</span>
              <Link href="/admin?tab=catalog" className="hover:text-slate-900 transition">Merchant Portal</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">
                {isEditing ? "Edit Wholesale Listing" : "Add New Jewelry Listing"}
              </span>
            </nav>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span>{isEditing ? `Edit Listing: ${formName || "Product"}` : "Amazon & Flipkart Style Jewelry Listing"}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                B2B Wholesale
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Step 1: Classify jewelry type &bull; Step 2: Define technical specifications, wholesale pricing &amp; SEO rankings.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin?tab=catalog"
              className="bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-xs font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg transition"
            >
              Cancel
            </Link>
            {currentStep === 2 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-sm transition uppercase tracking-wider flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>{isEditing ? "Save Changes" : "Publish Listing"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Amazon / Flipkart 2-Step Flow Indicator Bar */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-5 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center">
            {/* Step 1 Pill */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                currentStep === 1
                  ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    currentStep === 1
                      ? "bg-amber-400 text-slate-950"
                      : "bg-white text-slate-900 border border-slate-300"
                  }`}
                >
                  1
                </span>
                <div className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${currentStep === 1 ? "text-amber-300" : "text-slate-400"}`}>
                    Classification Step
                  </span>
                  <span className="font-bold text-xs sm:text-sm truncate block">
                    Select Jewelry Type &amp; Subcategory
                  </span>
                </div>
              </div>
              <span className="text-lg sm:text-xl shrink-0 ml-2">{currentTypeDef.icon}</span>
            </div>

            {/* Step 2 Pill */}
            <div
              onClick={() => {
                if (formCategory) setCurrentStep(2);
              }}
              className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                currentStep === 2
                  ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    currentStep === 2
                      ? "bg-amber-400 text-slate-950"
                      : "bg-white text-slate-900 border border-slate-300"
                  }`}
                >
                  2
                </span>
                <div className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${currentStep === 2 ? "text-amber-300" : "text-slate-400"}`}>
                    Specification &amp; SEO Step
                  </span>
                  <span className="font-bold text-xs sm:text-sm truncate block">
                    Define Details, Specs &amp; SEO Optimization
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold shrink-0 ml-2">
                <span className={`px-2 py-0.5 rounded-full ${seoScore >= 80 ? "bg-emerald-500 text-white" : "bg-amber-500 text-slate-950"}`}>
                  {seoScore}% SEO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE JEWELRY TYPE & SUBCATEGORY (FLIPKART / AMAZON TAXONOMY)   */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-800 block">
                    Product Classification Hierarchy
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                    Step 1: What type of jewelry are you listing?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select the core jewelry category. This dynamically customizes the attributes, sizing grids, and SEO keywords in Step 2.
                  </p>
                </div>

                {/* Search Bar for Category Types */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={taxonomySearch}
                    onChange={(e) => setTaxonomySearch(e.target.value)}
                    placeholder="Search type (e.g. Ring, Bangle)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Jewelry Types Grid - Fully Responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredJewelryTypes.map((typeDef) => {
                  const isSelected = formCategory === typeDef.category;
                  return (
                    <div
                      key={typeDef.id}
                      onClick={() => handleSelectJewelryType(typeDef)}
                      className={`relative rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border-2 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-amber-400/40"
                          : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:shadow-xs"
                      }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </span>
                      )}

                      <div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl sm:text-2xl mb-2.5 sm:mb-3 shadow-inner">
                          {typeDef.icon}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold">
                          {typeDef.title}
                        </h3>
                        <p className={`text-[11px] sm:text-xs mt-1 leading-snug line-clamp-2 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {typeDef.tagline}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/40">
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block mb-1 ${isSelected ? "text-amber-300" : "text-slate-400"}`}>
                          Attributes:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {typeDef.specHighlights.slice(0, 2).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                                isSelected ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-type refinement selector */}
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Refine {currentTypeDef.title} Sub-Type &amp; Design Style
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Choose {currentTypeDef.title} Silhouette / Setting:
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    Active: <strong className="text-slate-950">{formCategory}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {currentTypeDef.popularSubtypes.map((sub) => {
                    const isSubSelected = formSubType === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setFormSubType(sub)}
                        className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isSubSelected
                            ? "bg-slate-950 text-white shadow-sm ring-2 ring-amber-400/30"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-800"
                        }`}
                      >
                        {isSubSelected && <Check className="w-3 h-3 text-amber-400" />}
                        <span>{sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Proceed to Step 2 CTA */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 gap-3 sm:gap-4">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  Ready to configure <strong className="text-slate-900">{formCategory}{formSubType ? ` › ${formSubType}` : ""}</strong> specifications and wholesale pricing.
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
                >
                  <span>Continue to Step 2: Define Details &amp; SEO</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DYNAMIC DETAILS DEFINED BASED ON JEWELRY TYPE + SEO STUDIO        */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* LEFT COLUMN: Technical Specifications, Identification & SEO (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Type Confirmation Bar */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400/20 text-amber-300 text-xl sm:text-2xl flex items-center justify-center border border-amber-400/30 shrink-0">
                    {currentTypeDef.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Active Jewelry Classification
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>{formCategory}</span>
                      {formSubType ? (
                        <>
                          <span className="text-slate-400">&bull;</span>
                          <span className="text-amber-200">{formSubType}</span>
                        </>
                      ) : (
                        <span className="text-xs font-normal text-slate-400">(All Subtypes)</span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap w-full sm:w-auto items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 sm:flex-initial text-xs text-slate-300 hover:text-white font-semibold px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Type</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAutoGenerateSEO}
                    className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3.5 py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill SEO</span>
                  </button>
                </div>
              </div>

              {/* Quick Section Jump Navigation Strip */}
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs font-semibold">
                <a href="#section-specs" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  1. Specs
                </a>
                <a href="#section-stones" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  2. Stones
                </a>
                <a href="#section-metal" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  3. Metal &amp; Weight
                </a>
                <a href="#section-photos" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  4. Photos ({productImages.length})
                </a>
                <a href="#section-seo" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  5. SEO Studio
                </a>
                <a href="#section-pricing" className="lg:hidden px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  6. Pricing &amp; MOQ
                </a>
                <a href="#section-supplier" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 whitespace-nowrap transition">
                  7. Supplier (Private)
                </a>
              </div>

              {/* Notification Banner */}
              {seoNotification && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3 sm:p-3.5 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{seoNotification}</span>
                </div>
              )}

              {/* Section 1: Dynamic Jewelry Type-Specific Specifications */}
              <div id="section-specs" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span>{formCategory} Specifications (Amazon / Flipkart Attribute Schema)</span>
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                    Dynamic Schema
                  </span>
                </div>

                {/* Conditional Fields: RINGS */}
                {formCategory === "Rings" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-800 block mb-1">
                        Available Ring Sizes (US Standards) *
                      </label>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                        {["US 5", "US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "Free-Size Adjustable"].map((sz) => {
                          const isPicked = formRingSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                if (isPicked) setFormRingSizes(formRingSizes.filter((s) => s !== sz));
                                else setFormRingSizes([...formRingSizes, sz]);
                              }}
                              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                                isPicked
                                  ? "bg-slate-950 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Selected: {formRingSizes.join(", ") || "None selected"}
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Band Width (mm)</label>
                      <input
                        type="text"
                        value={formBandWidth}
                        onChange={(e) => setFormBandWidth(e.target.value)}
                        placeholder="e.g. 2.2mm, 4.0mm"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Setting Type</label>
                      <select
                        value={formSettingType}
                        onChange={(e) => setFormSettingType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Setting Type --</option>
                        <option value="4-Prong Setting">4-Prong Setting (Solitaire)</option>
                        <option value="6-Prong Classic">6-Prong Classic</option>
                        <option value="Bezel Setting">Bezel Setting (Rim Shield)</option>
                        <option value="Micro-Pavé Setting">Micro-Pavé Diamond Setting</option>
                        <option value="Channel Setting">Channel Setting</option>
                        <option value="Flush / Gypsy Setting">Flush / Gypsy Setting</option>
                        <option value="Tension Setting">Tension Setting</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Sizing Mechanism</label>
                      <select
                        value={formRingSizingType}
                        onChange={(e) => setFormRingSizingType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Sizing Mechanism --</option>
                        <option value="Standard Fixed Sizes">Standard Fixed Sizes</option>
                        <option value="Comfort-Fit Rounded Band">Comfort-Fit Rounded Band</option>
                        <option value="Open Flexible Adjustable">Open Flexible Adjustable</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: PENDANTS */}
                {formCategory === "Pendants" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Pendant Height (mm)</label>
                      <input
                        type="text"
                        value={formPendantHeight}
                        onChange={(e) => setFormPendantHeight(e.target.value)}
                        placeholder="e.g. 18mm, 24mm"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Pendant Width (mm)</label>
                      <input
                        type="text"
                        value={formPendantWidth}
                        onChange={(e) => setFormPendantWidth(e.target.value)}
                        placeholder="e.g. 12mm, 15mm"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        Bail Inner Opening Clearance (mm) *
                      </label>
                      <input
                        type="text"
                        value={formBailOpening}
                        onChange={(e) => setFormBailOpening(e.target.value)}
                        placeholder="e.g. 4.2mm (Fits up to 3.5mm Chains)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Retailers must know what chain thickness will fit.</p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Chain Inclusion</label>
                      <select
                        value={formChainInclusion}
                        onChange={(e) => setFormChainInclusion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Chain Option --</option>
                        <option value="Pendant Only (Chain Sold Separately)">Pendant Only (Chain Sold Separately)</option>
                        <option value="Includes 18&quot; 925 Italian Box Chain">Includes 18&quot; 925 Italian Box Chain</option>
                        <option value="Includes 16&quot;-18&quot; Adjustable Extender Chain">Includes 16&quot;-18&quot; Adjustable Extender Chain</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: BRACELETS */}
                {formCategory === "Bracelets" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Wrist Length (Inches / cm)</label>
                      <input
                        type="text"
                        value={formBraceletLength}
                        onChange={(e) => setFormBraceletLength(e.target.value)}
                        placeholder="e.g. 7.25 inches (18.5cm)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Clasp Mechanism</label>
                      <select
                        value={formClaspType}
                        onChange={(e) => setFormClaspType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Clasp Mechanism --</option>
                        <option value="Box Clasp with Dual Safety Latches">Box Clasp with Dual Safety Latches (Tennis Style)</option>
                        <option value="Heavy Duty Lobster Claw">Heavy Duty Lobster Claw</option>
                        <option value="Spring Ring Clasp">Spring Ring Clasp</option>
                        <option value="Bolo Slider Bead">Bolo Slider Bead (Adjustable)</option>
                        <option value="Toggle &amp; Bar">Toggle &amp; Bar</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-800 block mb-1">Link Structure / Setting</label>
                      <input
                        type="text"
                        value={formLinkStyle}
                        onChange={(e) => setFormLinkStyle(e.target.value)}
                        placeholder="e.g. 4-Prong Tennis Link, Paperclip Chain, Cuban Curb"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: NECKLACES */}
                {formCategory === "Necklaces" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Necklace Drop Length</label>
                      <select
                        value={formNecklaceLength}
                        onChange={(e) => setFormNecklaceLength(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Drop Length --</option>
                        <option value="14 inches (Choker Length)">14 inches (Choker Length)</option>
                        <option value="16 inches (Collar Length)">16 inches (Collar Length)</option>
                        <option value="18 inches (Princess Length)">18 inches (Princess Length)</option>
                        <option value="20 inches (Matinee Length)">20 inches (Matinee Length)</option>
                        <option value="24 inches (Opera Length)">24 inches (Opera Length)</option>
                        <option value="16-18 inches with 2&quot; Extender">16-18 inches with 2&quot; Extender</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Chain Weave</label>
                      <input
                        type="text"
                        value={formChainType}
                        onChange={(e) => setFormChainType(e.target.value)}
                        placeholder="e.g. Cable Link, Box Chain, Tennis Setting"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: BANGLES */}
                {formCategory === "Bangles" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Bangle Size / Inner Diameter</label>
                      <select
                        value={formBangleSize}
                        onChange={(e) => setFormBangleSize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Bangle Sizing --</option>
                        <option value="2.2 (54.0mm Inner Diameter)">2.2 (54.0mm Inner Diameter)</option>
                        <option value="2.4 (57.2mm Inner Diameter)">2.4 (57.2mm Inner Diameter)</option>
                        <option value="2.6 (60.3mm Inner Diameter)">2.6 (60.3mm Inner Diameter)</option>
                        <option value="2.8 (63.5mm Inner Diameter)">2.8 (63.5mm Inner Diameter)</option>
                        <option value="2.10 (66.7mm Inner Diameter)">2.10 (66.7mm Inner Diameter)</option>
                        <option value="Open Flexible Cuff (Adjustable)">Open Flexible Cuff (Adjustable)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Closure / Lock Mechanism</label>
                      <select
                        value={formClosureType}
                        onChange={(e) => setFormClosureType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Closure Mechanism --</option>
                        <option value="Hinged with Hidden Safety Lock">Hinged with Hidden Safety Lock</option>
                        <option value="Screw-Lock Kada Pin">Screw-Lock Kada Pin</option>
                        <option value="Solid Slip-On (Rigid)">Solid Slip-On (Rigid)</option>
                        <option value="Flexible Open Cuff">Flexible Open Cuff</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-800 block mb-1">Bangle Width / Profile (mm)</label>
                      <input
                        type="text"
                        value={formBangleWidth}
                        onChange={(e) => setFormBangleWidth(e.target.value)}
                        placeholder="e.g. 4.5mm Wire, 8mm Mid, 15mm Broad Kada"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: EARRINGS */}
                {formCategory === "Earrings" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Fastener / Back Finding</label>
                      <select
                        value={formEarringBacking}
                        onChange={(e) => setFormEarringBacking(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        <option value="">-- Select Back Finding --</option>
                        <option value="Push Back (Butterfly Friction)">Push Back (Butterfly Friction)</option>
                        <option value="Screw Back (Threaded Security)">Screw Back (Threaded Security)</option>
                        <option value="Lever Back (French Wire Snap)">Lever Back (French Wire Snap)</option>
                        <option value="Huggie Click-Latch">Huggie Click-Latch</option>
                        <option value="French Wire / Fish Hook">French Wire / Fish Hook</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Drop / Total Length (mm)</label>
                      <input
                        type="text"
                        value={formEarringDrop}
                        onChange={(e) => setFormEarringDrop(e.target.value)}
                        placeholder="e.g. 12mm Stud, 25mm Drop, 50mm Chandelier"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields: CHAINS */}
                {formCategory === "Chains" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Weave Pattern</label>
                      <input
                        type="text"
                        value={formChainWeave}
                        onChange={(e) => setFormChainWeave(e.target.value)}
                        placeholder="e.g. Diamond-Cut Curb, Figaro 3+1, Rope, Franco"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Gauge / Width (mm)</label>
                      <input
                        type="text"
                        value={formChainGauge}
                        onChange={(e) => setFormChainGauge(e.target.value)}
                        placeholder="e.g. 1.5mm, 3.0mm, 5.5mm, 8.0mm"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Gemstone & Stone Details (Flipkart / Amazon Jewelry Standards) */}
              <div id="section-stones" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>Gemstone &amp; Stone Specifications</span>
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-200">
                    Boutique Cut &amp; Clarity
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Gemstone Type</label>
                    <select
                      value={formGemstoneType}
                      onChange={(e) => setFormGemstoneType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                    >
                      <option value="">-- Select Gemstone Type --</option>
                      <option value="Plain Solid Silver (No Stone)">Plain Solid Silver (No Stone)</option>
                      <option value="Cubic Zirconia (AAA+ Optical Grade)">Cubic Zirconia (AAA+ Optical Grade)</option>
                      <option value="Moissanite (VVS1 DEF White)">Moissanite (VVS1 DEF White)</option>
                      <option value="Freshwater Cultured Pearl">Freshwater Cultured Pearl</option>
                      <option value="Natural Emerald / Ruby / Sapphire">Natural Gemstone (Precious)</option>
                      <option value="Black Onyx Enamel Inset">Black Onyx / Enamel Inset</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Stone Cut / Shape</label>
                    <select
                      value={formStoneCut}
                      onChange={(e) => setFormStoneCut(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                    >
                      <option value="">-- Select Stone Cut / Shape --</option>
                      <option value="Round Brilliant Cut">Round Brilliant Cut (58 Facets)</option>
                      <option value="Princess Cut (Square)">Princess Cut (Square)</option>
                      <option value="Emerald Cut (Step Facets)">Emerald Cut (Step Facets)</option>
                      <option value="Cushion Cut">Cushion Cut</option>
                      <option value="Oval Cut">Oval Cut</option>
                      <option value="Pear Teardrop Cut">Pear Teardrop Cut</option>
                      <option value="Marquise Cut">Marquise Cut</option>
                      <option value="Baguette Cut">Baguette Cut</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Carat Weight (CTW)</label>
                    <input
                      type="text"
                      value={formCaratWeight}
                      onChange={(e) => setFormCaratWeight(e.target.value)}
                      placeholder="e.g. 1.25 CTW, 0.50 CTW"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Stone Color Grade</label>
                    <input
                      type="text"
                      value={formStoneColor}
                      onChange={(e) => setFormStoneColor(e.target.value)}
                      placeholder="e.g. D-E-F Flawless White, Emerald Green"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Total Stone Count</label>
                    <input
                      type="number"
                      min="0"
                      value={formStoneCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormStoneCount(val === "" ? "" : parseInt(val, 10));
                      }}
                      placeholder="e.g. 1 center stone, 24 pave"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Precious Metal, Purity & Weight */}
              <div id="section-metal" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span>Precious Metal, Fineness &amp; Physical Specifications</span>
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                    UK Assay &amp; BIS 925
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Metal Purity *</label>
                    <input
                      type="text"
                      required
                      value={formPurity}
                      onChange={(e) => setFormPurity(e.target.value)}
                      placeholder="Solid 925 Sterling Silver"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Virgin 925/1000 millesimal fineness guaranteed.</p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Gram Weight (Crucial for Silver Wholesale Pricing) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formGramWeight}
                      onChange={(e) => setFormGramWeight(e.target.value)}
                      placeholder="e.g. 4.8g"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-950"
                    />
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
                      Typical range for {formCategory}: {currentTypeDef.typicalWeightRange}
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Protective Coating &amp; Finish *</label>
                    <input
                      type="text"
                      required
                      value={formFinish}
                      onChange={(e) => setFormFinish(e.target.value)}
                      placeholder="e.g. Anti-Tarnish Rhodium Plating & E-Coating"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Dimensions &amp; Sizing Specs *</label>
                    <input
                      type="text"
                      required
                      value={formDimensions}
                      onChange={(e) => setFormDimensions(e.target.value)}
                      placeholder="e.g. Band: 2.2mm | US 6, 7, 8 | 4-Prong Setting"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-start gap-3 p-3 sm:p-3.5 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                      <input
                        type="checkbox"
                        checked={formHallmarked}
                        onChange={(e) => setFormHallmarked(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-950 focus:ring-slate-950 mt-0.5 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          UK Assay Office Hallmarking Certified (London / Birmingham / BIS 925)
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                          Features official UK hallmark stamp and sponsor mark, legally required for silver items over 7.78g.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: High-Resolution Jewelry Photography */}
              <div id="section-photos" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">4</span>
                    <span>Jewelry Photography &amp; Visual Media</span>
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Supabase Storage Linked
                  </span>
                </div>

                {/* Drag & Drop File Upload Zone */}
                <div>
                  <label
                    htmlFor="product-photo-upload"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 sm:gap-3 ${
                      isDragging
                        ? "border-slate-900 bg-slate-100/80 ring-2 ring-slate-900/10"
                        : "border-slate-300 hover:border-slate-700 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      id="product-photo-upload"
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />

                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700">
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-slate-900" />
                      ) : (
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {isUploading
                          ? "Uploading photo to Supabase storage..."
                          : "Click to browse or drag & drop high-res jewelry photos"}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                        Stored in Supabase Storage bucket &bull; PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white shadow-xs hover:bg-slate-800 transition">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Select Images from Computer</span>
                    </span>
                  </label>

                  {uploadError && (
                    <p className="text-xs text-rose-600 mt-2 font-medium">{uploadError}</p>
                  )}
                </div>

                {/* Uploaded Photos Gallery */}
                {productImages.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        Attached Product Images ({productImages.length})
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-500">First photo is catalog thumbnail</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                      {productImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition bg-slate-100 ${
                            idx === 0
                              ? "border-amber-500 shadow-sm ring-2 ring-amber-400/20"
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Product Image ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={imgUrl.startsWith("data:")}
                          />

                          {idx === 0 && (
                            <span className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 px-1 sm:px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider flex items-center gap-0.5 sm:gap-1 shadow-sm">
                              <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-slate-950" /> Primary
                            </span>
                          )}

                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-1.5 sm:p-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                title="Delete photo"
                                className="p-1 sm:p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
                              >
                                <Trash2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                              </button>
                            </div>

                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(idx)}
                                className="w-full py-1 px-1 rounded bg-white/90 hover:bg-white text-slate-900 font-semibold text-[9px] sm:text-[10px] shadow-xs transition truncate"
                              >
                                Set Primary
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Studio Presets Toggle */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1 transition"
                  >
                    <span>{showPresets ? "Hide" : "Show"} curated jewelry photo library</span>
                    <span className="text-[10px]">{showPresets ? "▲" : "▼"}</span>
                  </button>

                  {showPresets && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] text-slate-500 mb-2">
                        Click any sample photography to attach it to this product listing:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPreset(preset.url)}
                            className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:border-slate-800 transition"
                          >
                            <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                            <span className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-end p-1 text-[8px] text-white font-bold leading-tight truncate">
                              + {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Flipkart & Amazon SEO Listing Studio */}
              <div id="section-seo" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5 scroll-mt-24">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">5</span>
                      <span>SEO &amp; Marketplace Listing Studio</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Structured metadata, keyword indexing, and SERP optimization for Google, Amazon, and wholesale buyers.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoGenerateSEO}
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate SEO Listing</span>
                  </button>
                </div>

                {/* SEO Health Audit Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      SEO Listing Quality Audit
                    </span>
                    <span className="text-xs font-extrabold font-mono px-2 py-0.5 rounded-full bg-slate-950 text-white">
                      {seoScore}% Health Score
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${seoScore}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-3 text-[10px] sm:text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      {formName.length >= 35 ? "✅" : "⚪"} Title (35-90 chars)
                    </span>
                    <span className="flex items-center gap-1">
                      {formKeyBullets.length >= 4 ? "✅" : "⚪"} 5 Bullet Points
                    </span>
                    <span className="flex items-center gap-1">
                      {formMetaDescription.length >= 100 ? "✅" : "⚪"} Meta Description
                    </span>
                    <span className="flex items-center gap-1">
                      {formSeoKeywords ? "✅" : "⚪"} Search Keywords
                    </span>
                  </div>
                </div>

                {/* SEO Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-800 text-xs">
                      SEO Optimized Product Title *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formName.length} / 90 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Solid 925 Sterling Silver Round Brilliant AAA Cubic Zirconia Solitaire Ring with Rhodium Finish - Wholesale"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold text-xs focus:outline-none focus:border-slate-950"
                  />
                </div>

                {/* SEO URL Slug - Responsive Stacking */}
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    URL Slug (Canonical Search Engine Handle) *
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-stretch bg-slate-50 border border-slate-300 rounded-lg overflow-hidden focus-within:border-slate-950">
                    <span className="bg-slate-100 text-slate-500 font-mono text-[10px] sm:text-[11px] px-2.5 py-1.5 sm:py-2 border-b sm:border-b-0 sm:border-r border-slate-200 select-none truncate">
                      argentsilverwholesale.com/product/
                    </span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="solid-925-sterling-silver-solitaire-ring"
                      className="w-full bg-transparent text-slate-900 font-mono font-bold text-xs p-2 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Amazon / Flipkart Style 5 Key Feature Bullets ("About this item") */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 text-xs">
                      Amazon / Flipkart 5 Key Feature Bullets (&quot;About this item&quot;)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormKeyBullets((prev) => [...prev, ""])}
                      className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  {formKeyBullets.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-2">
                      <p className="text-xs text-slate-500">
                        No feature bullets added yet. Leave blank, type custom points, or auto-generate with 1-click.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormKeyBullets([""])}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Bullet Point</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleAutoGenerateSEO}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auto-Generate 5 Bullets</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formKeyBullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2 items-start">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-2">
                            {bIdx + 1}
                          </span>
                          <textarea
                            rows={2}
                            value={bullet}
                            placeholder={`e.g. Feature bullet point #${bIdx + 1}...`}
                            onChange={(e) => {
                              const updated = [...formKeyBullets];
                              updated[bIdx] = e.target.value;
                              setFormKeyBullets(updated);
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-slate-950 leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormKeyBullets((prev) => prev.filter((_, idx) => idx !== bIdx));
                            }}
                            title="Remove bullet"
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition mt-1"
                          >
                            <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormKeyBullets((prev) => [...prev, ""])}
                        className="text-xs text-slate-600 hover:text-slate-950 font-semibold inline-flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add another bullet point</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-800 text-xs">
                      SEO Meta Description (SERP Snippet)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formMetaDescription.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formMetaDescription}
                    onChange={(e) => setFormMetaDescription(e.target.value)}
                    placeholder="Wholesale 925 sterling silver ring featuring AAA cubic zirconia and rhodium plating. Assay hallmarked, low MOQ 3 pcs, fast courier dispatch..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950 leading-relaxed"
                  />
                </div>

                {/* Search Keywords */}
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    High-Intent Search Keywords (Comma-separated for Amazon / Google Search)
                  </label>
                  <input
                    type="text"
                    value={formSeoKeywords}
                    onChange={(e) => setFormSeoKeywords(e.target.value)}
                    placeholder="wholesale silver ring UK, 925 solid sterling silver bulk, boutique jewelry supplier, solitaire ring"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                {/* Live Google Search Preview (SERP Card) */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-1 text-left overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" /> Google Search Result Preview
                  </span>
                  <div className="text-[11px] text-slate-600 truncate flex items-center gap-1 font-mono">
                    <span>https://argentsilverwholesale.com</span>
                    <span>&rsaquo;</span>
                    <span>catalog</span>
                    <span>&rsaquo;</span>
                    <span className="text-slate-800 font-semibold">{formCategory.toLowerCase()}</span>
                  </div>
                  <h4 className="text-blue-700 text-sm font-semibold hover:underline cursor-pointer truncate">
                    {formName || "Product Title | Argent & Co. Wholesale Silver"}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {formMetaDescription || "Browse wholesale 925 solid sterling silver with volume discounts and factory-direct pricing for retailers."}
                  </p>
                </div>
              </div>

              {/* Section 6: Private Sourcing & Supplier Details (Confidential / Internal Admin Only - Strictly No SEO) */}
              <div id="section-supplier" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-bold">6</span>
                    <span>Supplier Details &amp; Sourcing (Private Admin Only)</span>
                  </h2>
                  <span className="text-[10px] sm:text-[11px] text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full font-semibold border border-purple-200 inline-flex items-center gap-1">
                    <Lock className="w-3 h-3 text-purple-700" /> Private &bull; Strictly No SEO
                  </span>
                </div>

                <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3 text-[11px] text-purple-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold text-purple-900">Confidential Sourcing Information:</strong> This section is strictly private to store administrators for procurement, reordering, and margin management. It is <strong>never displayed</strong> on the public storefront, hidden from wholesale buyer accounts, and completely excluded from search engine crawlers and SEO metadata.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Supplier Name</label>
                    <input
                      type="text"
                      value={formSupplierName}
                      onChange={(e) => setFormSupplierName(e.target.value)}
                      placeholder="e.g. Arezzo Silver SpA, Bangkok Gems Ltd"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Supplier Product Code / Item Ref</label>
                    <input
                      type="text"
                      value={formSupplierProductCode}
                      onChange={(e) => setFormSupplierProductCode(e.target.value)}
                      placeholder="e.g. SUP-RNG-8821, IT-925-042"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-800">Supplier Product Link</label>
                      {formSupplierProductLink && (
                        <a
                          href={formSupplierProductLink.startsWith("http") ? formSupplierProductLink : `https://${formSupplierProductLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 transition"
                        >
                          <span>Open Supplier Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formSupplierProductLink}
                      onChange={(e) => setFormSupplierProductLink(e.target.value)}
                      placeholder="e.g. https://supplier-portal.com/catalog/item/8821"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Supplier Product Price (Unit Cost)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">£</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formSupplierPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormSupplierPrice(val === "" ? "" : parseFloat(val));
                        }}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  {typeof formSupplierPrice === "number" && formSupplierPrice > 0 && typeof formPriceGBP === "number" && formPriceGBP > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">
                        Internal Sourcing Gross Spread
                      </span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-base font-extrabold text-purple-950 font-mono">
                          +£{(formPriceGBP - formSupplierPrice).toFixed(2)} / unit
                        </span>
                        <span className="text-xs font-bold text-purple-800">
                          {Math.round(((formPriceGBP - formSupplierPrice) / formSupplierPrice) * 100)}% markup
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Wholesale Commercials, Margins & Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 self-start">
              {/* Card: Wholesale Pricing & Margin Calculator */}
              <div id="section-pricing" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <h3 className="text-sm sm:text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
                  Wholesale Pricing &amp; Margins
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Wholesale Price (GBP £) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">£</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={formPriceGBP}
                        onChange={(e) => {
                          const val = e.target.value;
                          handlePriceGBPChange(val === "" ? "" : parseFloat(val));
                        }}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Wholesale Price (USD $) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={formPriceUSD}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormPriceUSD(val === "" ? "" : parseFloat(val));
                        }}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-slate-950"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Auto-calculated at 1.30 transatlantic parity</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="font-bold text-slate-800 block mb-1">Suggested Retail Price (MSRP GBP £)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">£</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formSuggestedRetailGBP}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormSuggestedRetailGBP(val === "" ? "" : parseFloat(val));
                        }}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Suggested Retail Price (MSRP USD $)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formSuggestedRetailUSD}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormSuggestedRetailUSD(val === "" ? "" : parseFloat(val));
                        }}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  {/* Real-time Keystoning Margin Box */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1 text-emerald-950">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                      Boutique Retailer Margin Potential
                    </span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-black text-emerald-900">{keystoneMultiple}x</span>
                      <span className="text-xs font-bold text-emerald-800">+{markupPercent}% markup</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 block font-medium">
                      £{profitGBP.toFixed(2)} estimated gross profit per sold unit.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card: Warehouse Inventory & MOQ */}
              <div id="section-inventory" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 scroll-mt-24">
                <h3 className="text-sm sm:text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
                  Inventory Logistics &amp; MOQ
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-800">SKU Code *</label>
                      <button
                        type="button"
                        onClick={() => setFormSku(generateNewSku(formCategory))}
                        className="text-[10px] text-amber-800 hover:underline font-bold"
                      >
                        ⚡ Re-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      placeholder="AG-RNG-009"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Minimum Order Quantity (MOQ per line) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formMoq}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormMoq(val === "" ? "" : parseInt(val, 10));
                      }}
                      placeholder="e.g. 3"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Retailers must add at least this quantity to their bag.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Initial Warehouse In-Stock Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formStockCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormStockCount(val === "" ? "" : parseInt(val, 10));
                      }}
                      placeholder="e.g. 50"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Merchandising Badge</label>
                    <select
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                    >
                      <option value="">No Badge</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="New In">New In</option>
                      <option value="High Margin">High Margin</option>
                      <option value="Limited Run">Limited Run</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card: Action Panel */}
              <div className="bg-slate-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Ready to Publish
                  </span>
                  <h4 className="text-base sm:text-lg font-bold">
                    {isEditing ? "Update Wholesale Listing" : "Publish to Trade Catalog"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    The listing will be immediately available across the wholesale store with dynamic specifications and SEO tags.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing to Catalog...</span>
                      </>
                    ) : (
                      <>
                        <span>{isEditing ? "Save & Update Listing" : "Publish Wholesale Listing"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 rounded-lg block text-center transition"
                  >
                    &larr; Return to Step 1 (Change Type)
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Mobile Sticky Bottom Action Bar - Always Accessible on Phones & Tablets */}
        {currentStep === 2 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 py-2.5 shadow-lg flex items-center justify-between gap-2.5">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Wholesale</span>
              <span className="text-sm font-extrabold text-slate-950 font-mono truncate">
                {formPriceGBP !== "" ? `£${Number(formPriceGBP).toFixed(2)}` : "£0.00"}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${seoScore >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                {seoScore}% SEO
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>{isEditing ? "Save" : "Publish"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] p-8 text-xs text-slate-500">Loading New Listing Form...</div>}>
      <NewProductContent />
    </Suspense>
  );
}
