export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-pulse">
      {/* Breadcrumbs */}
      <div className="h-4 w-64 bg-gray-200 rounded mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
          <div className="h-10 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-xl pt-4"></div>
          <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
