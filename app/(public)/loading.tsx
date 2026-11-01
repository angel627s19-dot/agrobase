export default function GlobalLoading() {
  return (
    <div className="container mx-auto px-4 py-16 animate-pulse space-y-8">
      <div className="h-10 w-64 bg-gray-200 rounded mx-auto"></div>
      <div className="h-4 w-96 bg-gray-100 rounded mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
