export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          {/* Streak Card Skeleton */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-3xl animate-pulse h-48" />
          
          {/* Usage Card Skeleton */}
          <div className="bg-white p-6 rounded-2xl space-y-4 animate-pulse h-32" />
        </div>

        {/* Right Side Skeleton */}
        <div className="lg:col-span-9 space-y-8">
          {/* Header Skeleton */}
          <div className="mb-8 space-y-3">
            <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-96 animate-pulse" />
          </div>

          {/* Form Skeleton */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="h-2 w-full bg-slate-200 animate-pulse" />
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                  <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                  <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
                    <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                    <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="h-14 bg-slate-200 rounded-xl w-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-64 mt-3 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
