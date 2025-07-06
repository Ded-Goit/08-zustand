import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const note = await fetchNoteById(Number(params.id));

  return {
    title: `Note: ${note.title} | NoteHub`,
    description: note.content?.slice(0, 150) || "",
    openGraph: {
      title: `Note: ${note.title} | NoteHub`,
      description: note.content?.slice(0, 150) || "",
      url: `https://08-zustand-puce.vercel.app/notes/${params.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export default async function NoteDetails({
  params,
}: {
  params: { id: string };
}) {
  const parseId = Number(params.id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", parseId],
    queryFn: () => fetchNoteById(parseId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
