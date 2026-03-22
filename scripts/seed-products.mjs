#!/usr/bin/env node
/**
 * Seed script to populate Strapi CMS with 50 pharmaceutical products
 * Run: node scripts/seed-products.mjs
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://raysun-cms-production.up.railway.app'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100)
}

// 50 pharmaceutical products
const products = [
  // Antibiotics (9)
  { name: 'Amoxicillin Tablets 500mg', category: 'antibiotics', dosageForm: 'Film-coated Tablet', description: 'Broad-spectrum penicillin antibiotic.', indication: 'Bacterial infections', tags: 'antibiotic,oral', productType: 'generic' },
  { name: 'Ciprofloxacin Tablets 500mg', category: 'antibiotics', dosageForm: 'Film-coated Tablet', description: 'Fluoroquinolone antibiotic for UTI and respiratory infections.', indication: 'UTI, respiratory', tags: 'antibiotic,oral', productType: 'generic' },
  { name: 'Amoxicillin Capsules 500mg', category: 'antibiotics', dosageForm: 'Hard Capsule', description: 'Broad-spectrum antibiotic in capsule form.', indication: 'Bacterial infections', tags: 'antibiotic,oral', productType: 'generic' },
  { name: 'Ceftriaxone for Injection 1g', category: 'antibiotics', dosageForm: 'Powder for Injection', description: 'Third-generation cephalosporin for severe infections.', indication: 'Severe bacterial infections', tags: 'antibiotic,injectable', productType: 'generic' },
  { name: 'Gentamicin Injection 80mg/2ml', category: 'antibiotics', dosageForm: 'Solution for Injection', description: 'Aminoglycoside for serious gram-negative infections.', indication: 'Gram-negative infections', tags: 'antibiotic,injectable', productType: 'generic' },
  { name: 'Fluconazole Capsules 150mg', category: 'antibiotics', dosageForm: 'Hard Capsule', description: 'Antifungal for systemic and superficial fungal infections.', indication: 'Fungal infections', tags: 'antifungal,oral', productType: 'generic' },
  { name: 'Azithromycin Tablets 250mg', category: 'antibiotics', dosageForm: 'Film-coated Tablet', description: 'Macrolide antibiotic for respiratory and soft tissue infections.', indication: 'Respiratory infections', tags: 'antibiotic,oral', productType: 'generic' },
  { name: 'Doxycycline Capsules 100mg', category: 'antibiotics', dosageForm: 'Hard Capsule', description: 'Tetracycline antibiotic for a wide range of infections.', indication: 'Various infections', tags: 'antibiotic,oral', productType: 'generic' },
  { name: 'Metronidazole Tablets 400mg', category: 'antibiotics', dosageForm: 'Tablet', description: 'Antiprotozoal and antibacterial for anaerobic infections.', indication: 'Anaerobic infections', tags: 'antibiotic,oral', productType: 'generic' },

  // Cardiovascular (7)
  { name: 'Amlodipine Tablets 5mg', category: 'cardiovascular', dosageForm: 'Tablet', description: 'Calcium channel blocker for hypertension and angina.', indication: 'Hypertension', tags: 'cardiovascular,oral', productType: 'generic' },
  { name: 'Atorvastatin Tablets 20mg', category: 'cardiovascular', dosageForm: 'Film-coated Tablet', description: 'Statin for cholesterol management and cardiovascular risk reduction.', indication: 'Hyperlipidemia', tags: 'cardiovascular,oral', productType: 'generic' },
  { name: 'Losartan Tablets 50mg', category: 'cardiovascular', dosageForm: 'Film-coated Tablet', description: 'ARB for hypertension and nephropathy in diabetics.', indication: 'Hypertension', tags: 'cardiovascular,oral', productType: 'generic' },
  { name: 'Aspirin Tablets 100mg', category: 'cardiovascular', dosageForm: 'Enteric-coated Tablet', description: 'Low-dose aspirin for cardiovascular event prevention.', indication: 'Cardiovascular prevention', tags: 'cardiovascular,oral', productType: 'generic' },
  { name: 'Metformin HCl Tablets 850mg', category: 'cardiovascular', dosageForm: 'Tablet', description: 'First-line antidiabetic with cardiovascular benefits.', indication: 'Type 2 diabetes', tags: 'diabetes,oral', productType: 'generic' },
  { name: 'Omega-3 Fish Oil Softgels 1000mg', category: 'cardiovascular', dosageForm: 'Softgel', description: 'EPA/DHA omega-3 for cardiovascular health support.', indication: 'Cardiovascular support', tags: 'supplement,heart', productType: 'brand' },
  { name: 'CoQ10 Softgels 100mg', category: 'cardiovascular', dosageForm: 'Softgel', description: 'Coenzyme Q10 for cellular energy and heart health.', indication: 'Cardiovascular support', tags: 'antioxidant,heart', productType: 'brand' },

  // Pain & Inflammation (6)
  { name: 'Ibuprofen Tablets 400mg', category: 'pain', dosageForm: 'Film-coated Tablet', description: 'NSAID for pain, inflammation, and fever relief.', indication: 'Pain, inflammation, fever', tags: 'NSAID,analgesic', productType: 'generic' },
  { name: 'Diclofenac Gel 1%', category: 'pain', dosageForm: 'Topical Gel', description: 'Topical NSAID for localized pain and inflammation.', indication: 'Joint pain, sports injuries', tags: 'analgesic,topical', productType: 'generic' },
  { name: 'Diclofenac Sodium Injection 75mg/3ml', category: 'pain', dosageForm: 'Solution for Injection', description: 'Injectable NSAID for acute and post-operative pain.', indication: 'Acute pain', tags: 'analgesic,injectable', productType: 'generic' },
  { name: 'Paracetamol Tablets 500mg', category: 'pain', dosageForm: 'Tablet', description: 'Analgesic and antipyretic for mild to moderate pain.', indication: 'Pain, fever', tags: 'analgesic,oral', productType: 'generic' },
  { name: 'Naproxen Tablets 250mg', category: 'pain', dosageForm: 'Tablet', description: 'NSAID for musculoskeletal and joint pain relief.', indication: 'Arthritis, pain', tags: 'NSAID,oral', productType: 'generic' },
  { name: 'Tramadol Capsules 50mg', category: 'pain', dosageForm: 'Hard Capsule', description: 'Opioid analgesic for moderate to moderately severe pain.', indication: 'Moderate pain', tags: 'opioid,oral', productType: 'generic' },

  // Dermatology (5)
  { name: 'Hydrocortisone Cream 1%', category: 'dermatology', dosageForm: 'Cream', description: 'Mild corticosteroid for inflammatory skin conditions.', indication: 'Eczema, dermatitis', tags: 'dermatology,topical', productType: 'generic' },
  { name: 'Clotrimazole Cream 1%', category: 'dermatology', dosageForm: 'Cream', description: 'Topical antifungal for skin infections.', indication: 'Fungal skin infections', tags: 'antifungal,topical', productType: 'generic' },
  { name: 'Betamethasone Cream 0.05%', category: 'dermatology', dosageForm: 'Cream', description: 'Potent corticosteroid for severe skin conditions.', indication: 'Psoriasis, severe eczema', tags: 'dermatology,topical', productType: 'generic' },
  { name: 'Miconazole Cream 2%', category: 'dermatology', dosageForm: 'Cream', description: 'Antifungal for dermatophyte and yeast skin infections.', indication: 'Fungal skin infections', tags: 'dermatology,antifungal', productType: 'generic' },
  { name: 'Benzoyl Peroxide Gel 5%', category: 'dermatology', dosageForm: 'Gel', description: 'Antimicrobial for mild to moderate acne treatment.', indication: 'Acne vulgaris', tags: 'dermatology,acne', productType: 'generic' },

  // Vitamins & Supplements (7)
  { name: 'Multivitamin Complex Tablets', category: 'vitamins', dosageForm: 'Tablet', description: 'Comprehensive daily multivitamin with essential minerals.', indication: 'Nutritional support', tags: 'vitamin,daily', productType: 'brand' },
  { name: 'Vitamin C Tablets 1000mg', category: 'vitamins', dosageForm: 'Chewable Tablet', description: 'High-dose vitamin C for immune support.', indication: 'Immune support', tags: 'vitamin,immune', productType: 'brand' },
  { name: 'Iron + Folic Acid Tablets', category: 'vitamins', dosageForm: 'Tablet', description: 'Iron supplementation with folic acid for anemia prevention.', indication: 'Iron deficiency', tags: 'mineral,women', productType: 'brand' },
  { name: 'Calcium + Vitamin D3 Tablets', category: 'vitamins', dosageForm: 'Tablet', description: 'Calcium with vitamin D3 for bone strength.', indication: 'Bone health', tags: 'mineral,bone health', productType: 'brand' },
  { name: 'Vitamin D3 Softgels 5000 IU', category: 'vitamins', dosageForm: 'Softgel', description: 'High-potency vitamin D3 for bone and immune health.', indication: 'Vitamin D deficiency', tags: 'vitamin,bone health', productType: 'brand' },
  { name: 'Evening Primrose Oil Softgels 1000mg', category: 'vitamins', dosageForm: 'Softgel', description: 'GLA source for hormonal balance and skin health.', indication: 'Hormonal balance', tags: 'supplement,women', productType: 'brand' },
  { name: 'Zinc Tablets 50mg', category: 'vitamins', dosageForm: 'Tablet', description: 'Essential mineral for immune function and wound healing.', indication: 'Immune support', tags: 'mineral,immune', productType: 'brand' },

  // Gastrointestinal (5)
  { name: 'Omeprazole Capsules 20mg', category: 'gastrointestinal', dosageForm: 'Enteric-coated Capsule', description: 'Proton pump inhibitor for acid reflux and ulcers.', indication: 'GERD, peptic ulcer', tags: 'GI,oral', productType: 'generic' },
  { name: 'Lansoprazole Capsules 30mg', category: 'gastrointestinal', dosageForm: 'Delayed-release Capsule', description: 'PPI for GERD and duodenal ulcer treatment.', indication: 'GERD, duodenal ulcer', tags: 'GI,oral', productType: 'generic' },
  { name: 'Oral Rehydration Salts', category: 'gastrointestinal', dosageForm: 'Powder for Solution', description: 'WHO-formula ORS for dehydration management.', indication: 'Dehydration', tags: 'GI,essential', productType: 'generic' },
  { name: 'Loperamide Capsules 2mg', category: 'gastrointestinal', dosageForm: 'Capsule', description: 'Antidiarrheal for acute diarrhea control.', indication: 'Acute diarrhea', tags: 'GI,oral', productType: 'generic' },
  { name: 'Ranitidine Tablets 150mg', category: 'gastrointestinal', dosageForm: 'Tablet', description: 'H2 blocker for gastric acid reduction.', indication: 'GERD, gastritis', tags: 'GI,oral', productType: 'generic' },

  // Respiratory (4)
  { name: 'Salbutamol Inhaler 100mcg', category: 'respiratory', dosageForm: 'Metered-dose Inhaler', description: 'Bronchodilator for asthma and COPD symptom relief.', indication: 'Asthma, COPD', tags: 'respiratory,inhaled', productType: 'generic' },
  { name: 'Cetirizine Tablets 10mg', category: 'respiratory', dosageForm: 'Tablet', description: 'Antihistamine for allergic rhinitis and urticaria.', indication: 'Allergies', tags: 'antihistamine,oral', productType: 'generic' },
  { name: 'Dextromethorphan Syrup', category: 'respiratory', dosageForm: 'Syrup', description: 'Cough suppressant for dry and irritating cough.', indication: 'Dry cough', tags: 'respiratory,oral', productType: 'generic' },
  { name: 'Loratadine Tablets 10mg', category: 'respiratory', dosageForm: 'Tablet', description: 'Non-sedating antihistamine for allergies.', indication: 'Allergic rhinitis', tags: 'antihistamine,oral', productType: 'generic' },

  // Traditional / Herbal (4)
  { name: 'Herbal Cough Syrup', category: 'traditional', dosageForm: 'Syrup', description: 'Traditional herbal formulation for cough relief.', indication: 'Cough, sore throat', tags: 'herbal,respiratory', productType: 'brand' },
  { name: 'Turmeric Extract Capsules', category: 'traditional', dosageForm: 'Capsule', description: 'Standardized curcumin for anti-inflammatory support.', indication: 'Inflammation', tags: 'herbal,anti-inflammatory', productType: 'brand' },
  { name: 'Ginger Root Extract Tablets', category: 'traditional', dosageForm: 'Tablet', description: 'Traditional remedy for digestive comfort and nausea.', indication: 'Nausea, digestion', tags: 'herbal,GI', productType: 'brand' },
  { name: 'Moringa Leaf Capsules', category: 'traditional', dosageForm: 'Capsule', description: 'Nutrient-dense superfood supplement.', indication: 'Nutritional support', tags: 'herbal,supplement', productType: 'brand' },

  // Other (3)
  { name: 'Metformin HCl Tablets 500mg', category: 'other', dosageForm: 'Tablet', description: 'Oral antidiabetic for type 2 diabetes management.', indication: 'Type 2 diabetes', tags: 'diabetes,oral', productType: 'generic' },
  { name: 'Prednisolone Tablets 5mg', category: 'other', dosageForm: 'Tablet', description: 'Corticosteroid for inflammatory and autoimmune conditions.', indication: 'Inflammation, allergy', tags: 'steroid,oral', productType: 'generic' },
  { name: 'Albendazole Tablets 400mg', category: 'other', dosageForm: 'Chewable Tablet', description: 'Anthelmintic for intestinal worm infections.', indication: 'Worm infections', tags: 'antiparasitic,oral', productType: 'generic' },
]

async function createProduct(product) {
  try {
    const url = `${STRAPI_URL}/api/products`
    const headers = {
      'Content-Type': 'application/json',
    }
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
    }

    // Add generated slug
    const productData = {
      ...product,
      slug: generateSlug(product.name),
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: productData }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error(`Failed to create ${product.name}: ${res.status} - ${error}`)
      return null
    }

    const data = await res.json()
    console.log(`✅ Created: ${product.name} (ID: ${data.data?.id})`)
    return data.data
  } catch (error) {
    console.error(`❌ Error creating ${product.name}:`, error.message)
    return null
  }
}

async function publishProduct(documentId) {
  try {
    const url = `${STRAPI_URL}/api/products/${documentId}/publish`
    const headers = {
      'Content-Type': 'application/json',
    }
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
    })

    if (!res.ok) {
      const error = await res.text()
      console.error(`Failed to publish ${documentId}: ${res.status} - ${error}`)
      return false
    }

    console.log(`📢 Published: ${documentId}`)
    return true
  } catch (error) {
    console.error(`❌ Error publishing ${documentId}:`, error.message)
    return false
  }
}

async function seed() {
  console.log(`🚀 Seeding ${products.length} products to ${STRAPI_URL}...`)
  console.log('')

  let created = 0
  let published = 0
  let failed = 0

  for (const product of products) {
    const result = await createProduct(product)
    if (result) {
      created++
      // Publish the product
      const pubResult = await publishProduct(result.documentId)
      if (pubResult) {
        published++
      }
    } else {
      failed++
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100))
  }

  console.log('')
  console.log('📊 Seeding Complete:')
  console.log(`   ✅ Created: ${created}/${products.length}`)
  console.log(`   📢 Published: ${published}/${products.length}`)
  console.log(`   ❌ Failed: ${failed}/${products.length}`)

  if (failed > 0) {
    process.exit(1)
  }
}

seed()
