import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const parseId = Number(id);
  queryClient.prefetchQuery({
    queryKey: ["note", parseId],
    queryFn: () => fetchNoteById(parseId),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </>
  );
}

export default NoteDetails;
