import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ListingCardSkeleton() {
  return (
    <section className="rounded-md border-border/90 border-[1px] p-4 space-y-4 max-w-[300px] h-max">
      <Skeleton className="h-6 w-3/4" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="aspect-video w-full h-[250px] rounded-md" />

      <Separator className="border-border/90" />

      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </section>
  );
}
