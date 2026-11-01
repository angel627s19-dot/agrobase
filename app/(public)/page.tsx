import { HeroSection } from '@/components/home/HeroSection';
import { HeroSearch } from '@/components/home/HeroSearch';
import { TrustBar } from '@/components/home/TrustBar';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandsSection } from '@/components/home/BrandsSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { LocationSection } from '@/components/home/LocationSection';
import { CTASection } from '@/components/home/CTASection';
import { generateLocalBusinessJsonLd, generateOrganizationJsonLd } from '@/lib/seo';

export default function HomePage() {
  const localBusinessJsonLd = generateLocalBusinessJsonLd();
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="flex flex-col w-full overflow-hidden relative">
        <HeroSection />
        <HeroSearch />
        <TrustBar />
        <CategorySection />
        <FeaturedProducts />
        <BrandsSection />
        <WhyChooseUs />
        <ReviewsSection />
        <LocationSection />
        <CTASection />
      </div>
    </>
  );
}
