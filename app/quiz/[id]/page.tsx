import { QuizInterface } from "@/components/quiz-interface"

export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizInterface quizId={params.id} />
}
