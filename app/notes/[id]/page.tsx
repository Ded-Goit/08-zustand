import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
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

type NoteDetailsProps = {
  params: { id: string };
};

async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = params;
  const parseId = Number(id);
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

export default NoteDetails;
