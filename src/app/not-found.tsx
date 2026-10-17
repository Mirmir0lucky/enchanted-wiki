import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <Empty>
        <EmptyMedia>
          <SearchX />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>The page you are looking for does not exist or was moved.</EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </Empty>
    </div>
  );
}
