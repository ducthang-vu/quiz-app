import Stepper from '@/app/_ui/stepper';
import styles from './page.module.css';
import { QuizQuestion, QuizQuestionMetadata } from '@/lib/quiz-service/types';
import { cookies } from 'next/headers';
import RadioGroup from '@/app/_ui/form-controls/radio-group';
import Button from '@/app/_ui/button';
import { quizService } from '@/lib/quiz-service/service';
import { COOKIE_NAME } from '@/app/constants';
import { redirect } from 'next/navigation';
import { AlreadyAnsweredError } from '@/lib/errors';
import { Banner } from '@/app/_ui/banner';

interface PageProps {
    params: Promise<{ id: string }>;
}

function answerQuestionFactory(questionIndex: number, userId: string, isLast: boolean) {
    return async (formValue: FormData): Promise<void> => {
        "use server";
        const answer = formValue.get('answer') as string;
        try {
            await quizService.answerQuestion(userId, { questionIndex, answer });
        } catch (e) {
            // should never happen
            if (e instanceof AlreadyAnsweredError) {
                // TODO need to communicate to use
                redirect(`/quiz/${e.lastAnsweredQuestion + 1}`);
            } else {
                console.error('Error answering question:', e);
                throw e; // Re-throw the error to be handled by Next.js
            }
        }
        const url = isLast ? '/quiz/end' : `/quiz/${questionIndex + 1}`;
        redirect(url);
    }
}

function goToCurrentQuestionFactory(questionIndex: number) {
    return async () => {
        "use server";
        redirect(`/quiz/${questionIndex + 1}`);
    }
}

export default async function Question({ params }: PageProps) {
    const p: { id: string } = await params;
    const questionIndex = Number(p.id);
    const cookie = await cookies();
    const id = cookie.get(COOKIE_NAME)?.value;

    if (!id) {
        console.error(`Cookie ${id} not found`);
        redirect('/404');
    }

    const question: QuizQuestion & QuizQuestionMetadata = await quizService.getQuestion(id, { questionIndex }).catch(
        (e: unknown) => {
            console.error(e)
            redirect('/404')
        }
    );

    const answerQuestion = answerQuestionFactory(questionIndex, id, questionIndex + 1 === question.total);
    const goToCurrentQuestion = goToCurrentQuestionFactory(question.currentQuestionIndex);

    return (
        <>
            <div className={styles.stepper}>
                <Stepper current={ questionIndex + 1 } total={question.total}></Stepper>
            </div>

            <form className={styles.question} action={answerQuestion}>
                <RadioGroup
                    legend={question.question}
                    name="answer"
                    options={question.options}
                    disabled={!!question.answer}
                    value={question.answer ?? undefined}
                />
                { question.answer
                    ? <Banner>
                        <p className={styles.bannerContent}>
                            <span>
                            You already answered this question with: <strong>{question.answer}</strong>
                            </span>
                            <Button
                                type="button"
                                appearance="tertiary"
                                onClick={goToCurrentQuestion}
                            >Go to current question</Button>
                        </p>
                    </Banner>
                    : <Button type="submit" disabled={!!question.answer}>Answer</Button>
                }
            </form>
        </>
    )
}
