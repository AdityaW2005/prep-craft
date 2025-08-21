import { FlashcardViewer } from "@/components/flashcard-viewer"

export default function FlashcardsPage({ params }: { params: { id: string } }) {
  return <FlashcardViewer deckId={params.id} />
}
