const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clear existing data
  console.log('🧹 Clearing existing data...');
  try {
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customerAddress.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
    await prisma.siteSettings.deleteMany();
    await prisma.analyticsEvent.deleteMany();
  } catch (err) {
    console.log('Notice: Tables might be empty or newly created.');
  }

  // 2. Create Owner & Admin Users
  console.log('👤 Creating owner and admin users...');
  const hashedOwnerPassword = await bcrypt.hash('Owner@123', 10);
  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.create({
    data: {
      username: 'AGRO',
      email: 'owner@sevlaniagro.com',
      password: hashedOwnerPassword,
      name: 'Sevlani Agro Owner',
      role: 'OWNER',
    },
  });

  await prisma.user.create({
    data: {
      username: 'ADMIN',
      email: 'admin@sevlaniagro.com',
      password: hashedAdminPassword,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  // 3. Create Brands
  console.log('🏷️ Creating brands...');
  const brandsData = [
    { name: 'Kothari', slug: 'kothari', description: 'Premier agricultural and drip irrigation solutions' },
    { name: 'Paras', slug: 'paras', description: 'Durable irrigation and plumbing hardware' },
    { name: 'SKF', slug: 'skf', description: 'High-grade industrial greases and accessories' },
    { name: 'Araldite', slug: 'araldite', description: 'High-performance standard and epoxy adhesives' },
    { name: 'WD-40', slug: 'wd-40', description: 'Multi-use lubricants and rust-prevention sprays' },
    { name: 'Maruti', slug: 'maruti', description: 'Reliable brass and metal plumbing ball valves' },
    { name: 'Balaji', slug: 'balaji', description: 'Precision pipe fittings, couplers and parts' },
  ];

  const brands = await Promise.all(
    brandsData.map((b) =>
      prisma.brand.create({
        data: {
          name: b.name,
          slug: b.slug,
          description: b.description,
          isActive: true,
        },
      })
    )
  );
  
  const getBrandId = (name: string) => brands.find((b) => b.name.toLowerCase() === name.toLowerCase())?.id;

  // 4. Create Categories & Subcategories
  console.log('📂 Creating categories...');
  const categoryStructure = [
    {
      name: 'Agriculture',
      slug: 'agriculture',
      order: 1,
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=600',
      icon: 'Sprout',
      subs: ['Garden Pipes', 'Irrigation Pipes', 'HDPE Pipes', 'MDPE Pipes', 'LDPE Pipes'],
    },
    {
      name: 'Fittings',
      slug: 'fittings',
      order: 2,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      icon: 'Wrench',
      subs: ['GI Fittings', 'CI Fittings', 'Brass Fittings', 'Ball Valves', 'Couplers'],
    },
    {
      name: 'Pipes',
      slug: 'pipes',
      order: 3,
      image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600',
      icon: 'Pipette',
      subs: ['PVC Pipes', 'HDPE Pipes', 'GI Pipes', 'Spray Hose'],
    },
    {
      name: 'Hardware',
      slug: 'hardware',
      order: 4,
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600',
      icon: 'Hammer',
      subs: ['Locks', 'Tapes', 'Adhesives', 'Tools'],
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      order: 5,
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
      icon: 'Droplets',
      subs: ['Grease', 'Gloves', 'Spray Pipes'],
    },
  ];

  const categories: Record<string, any> = {};
  for (const parent of categoryStructure) {
    const parentCat = await prisma.category.create({
      data: {
        name: parent.name,
        slug: parent.slug,
        order: parent.order,
        image: parent.image,
        icon: parent.icon,
        isActive: true,
      },
    });
    categories[parent.name] = parentCat;

    for (const sub of parent.subs) {
      await prisma.category.create({
        data: {
          name: sub,
          slug: `${parentCat.slug}-${sub.toLowerCase().replace(/ /g, '-')}`,
          parentId: parentCat.id,
          isActive: true,
        },
      });
    }
  }

  // 5. Create 25 Realistic Products
  console.log('📦 Creating 25 demo products...');
  const demoProducts = [
    { name: 'Kothari Spray Hose', cat: 'Agriculture', brand: 'Kothari', price: 2900, sale: 2450, stock: 25, img: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600' },
    { name: 'HDPE Pipe 50mm (100m roll)', cat: 'Pipes', brand: 'Kothari', price: 1450, sale: null, stock: 40, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'MDPE Pipe 32mm', cat: 'Pipes', brand: 'Paras', price: 780, sale: null, stock: 15, img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=600' },
    { name: 'LDPE Pipe 16mm (100m)', cat: 'Pipes', brand: 'Balaji', price: 450, sale: null, stock: 50, img: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600' },
    { name: 'Brass Ball Valve 1 inch', cat: 'Fittings', brand: 'Maruti', price: 380, sale: 320, stock: 30, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'GI Elbow 90° 1 inch', cat: 'Fittings', brand: null, price: 120, sale: null, stock: 100, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'Garden Pipe 30m Green', cat: 'Agriculture', brand: 'Kothari', price: 850, sale: 750, stock: 20, img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600' },
    { name: 'WD-40 Multi-Use Spray 400ml', cat: 'Hardware', brand: 'WD-40', price: 420, sale: null, stock: 45, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'PVC Coupler 2 inch', cat: 'Fittings', brand: null, price: 65, sale: null, stock: 200, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'Araldite Standard Epoxy 13ml', cat: 'Hardware', brand: 'Araldite', price: 95, sale: null, stock: 60, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'HDPE Pipe 63mm', cat: 'Pipes', brand: 'Kothari', price: 2100, sale: null, stock: 15, img: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600' },
    { name: 'Pipe Coupler Steel 3 inch', cat: 'Fittings', brand: 'Maruti', price: 210, sale: null, stock: 45, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'Safety Gloves Industrial', cat: 'Accessories', brand: null, price: 180, sale: null, stock: 80, img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600' },
    { name: 'Teflon Tape Roll (10 pack)', cat: 'Hardware', brand: null, price: 150, sale: null, stock: 120, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'Brass Nipple 1/2 inch', cat: 'Fittings', brand: null, price: 45, sale: null, stock: 150, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'GI Union 1 inch', cat: 'Fittings', brand: null, price: 185, sale: null, stock: 75, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'Irrigation Sprinkler Head', cat: 'Agriculture', brand: 'Paras', price: 250, sale: null, stock: 65, img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=600' },
    { name: 'Multi-Purpose Grease 500g', cat: 'Accessories', brand: 'SKF', price: 340, sale: null, stock: 40, img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600' },
    { name: 'PVC Ball Valve 2 inch', cat: 'Fittings', brand: null, price: 145, sale: null, stock: 90, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'HDPE Elbow 50mm', cat: 'Fittings', brand: 'Kothari', price: 85, sale: null, stock: 110, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
    { name: 'Garden Spray Gun', cat: 'Agriculture', brand: null, price: 420, sale: 380, stock: 35, img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=600' },
    { name: 'Adhesive Tape Heavy Duty', cat: 'Hardware', brand: null, price: 60, sale: null, stock: 150, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'Drip Irrigation Kit (100m)', cat: 'Agriculture', brand: 'Paras', price: 3500, sale: 3200, stock: 15, img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=600' },
    { name: 'Foot Valve 2 inch Brass', cat: 'Fittings', brand: 'Maruti', price: 480, sale: null, stock: 25, img: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600' },
    { name: 'Spray Pipe 100ft', cat: 'Agriculture', brand: 'Kothari', price: 1800, sale: 1600, stock: 20, img: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600' },
  ];

  for (let i = 0; i < demoProducts.length; i++) {
    const p = demoProducts[i];
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: `Premium quality ${p.name.toLowerCase()}. Ideal for agricultural, irrigation and plumbing applications. Provides high durability and long-lasting performance.`,
        price: p.price,
        discountPrice: p.sale,
        stock: p.stock,
        lowStockThreshold: 5,
        published: true,
        featured: i < 8,
        sku: `SA-${p.cat.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        features: JSON.stringify(['High Durability', 'Weather Resistant', 'Tested Standard Quality', 'Easy Installation']),
        specifications: JSON.stringify({ Category: p.cat, Guarantee: 'Standard Manufacturer Warranty' }),
        seoTitle: `${p.name} | Sevlani Agro Sangli`,
        seoDescription: `Buy ${p.name} online at best wholesale rates from Sevlani Agro, Sangli.`,
        categoryId: categories[p.cat].id,
        ...(p.brand && { brandId: getBrandId(p.brand) }),
        images: {
          create: [{ url: p.img, alt: p.name, isPrimary: true, order: 0 }]
        }
      }
    });
  }

  // 6. Create Site Settings
  console.log('⚙️ Creating site settings...');
  const settingsEntries = [
    { key: 'business_name', value: 'Sevlani Agro', group: 'general' },
    { key: 'business_tagline', value: 'Your Trusted Partner for Pipes, Fittings & Agricultural Solutions', group: 'general' },
    { key: 'business_phone', value: '+91 9999999999', group: 'general' },
    { key: 'business_whatsapp', value: '+91 9999999999', group: 'general' },
    { key: 'business_email', value: 'info@sevlaniagro.com', group: 'general' },
    { key: 'business_address', value: '87B, Mahaveer Nagar, Vakhar Bhag, Sangli-Miraj-Kupwad, Maharashtra 416416, India', group: 'general' },
    { key: 'business_hours', value: 'Mon - Sat: 9:00 AM - 8:00 PM', group: 'general' },
    { key: 'google_rating', value: '4.6', group: 'general' },
  ];

  for (const s of settingsEntries) {
    await prisma.siteSettings.create({
      data: s,
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
