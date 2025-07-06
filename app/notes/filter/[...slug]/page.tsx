import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Note } from "@/types/note";

type NotesProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Notes({ params }: NotesProps) {
  const resolvedParams = await params;

  // Перевірка slug
  const slug = resolvedParams?.slug;
  const tag =
    Array.isArray(slug) && slug.length > 0 && slug[0] !== "all" ? slug[0] : "";

  const queryClient = new QueryClient();

  const initialQuery: string = "";
  const initialPage: number = 1;

  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", initialQuery, initialPage, tag],
      queryFn: () => fetchNotes(initialQuery, initialPage, tag),
    });
  } catch (error) {
    console.error("Error prefetching notes:", error);
  }

  const initialData = queryClient.getQueryData([
    "notes",
    initialQuery,
    initialPage,
    tag,
  ]) as
    | {
        notes: Note[];
        totalPages: number;
      }
    | undefined;

  // Перевірка initialData
  if (!initialData || !Array.isArray(initialData.notes)) {
    console.warn("No valid initial data for notes.");
    return <p>Failed to load notes.</p>;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        query={initialQuery}
        page={initialPage}
        initialData={initialData}
        tag={tag}
      />
    </HydrationBoundary>
  );
}

export const dynamic = "force-dynamic";
