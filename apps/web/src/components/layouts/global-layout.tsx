export function GlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="relative rounded-none border border-border bg-background">
        {children}
      </div>
    </div>
  )
}
