import { StudyGuideDisplay } from "@/components/study-guide-display"

export default function StudyGuidePage({ params }: { params: { id: string } }) {
  return <StudyGuideDisplay guideId={params.id} />
}
