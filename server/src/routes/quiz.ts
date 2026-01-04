import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateArchetype } from '../utils/scoring';

const router = Router();

// Start a new quiz attempt
router.post('/start', async (req: AuthRequest, res) => {
  const userId = req.userId;

  try {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: userId || null,
        isCompleted: false,
      },
    });
    res.json(attempt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start quiz attempt' });
  }
});

// Save a response
router.post('/response', async (req: AuthRequest, res) => {
  const { attemptId, questionId, value } = req.body;

  try {
    const response = await prisma.quizResponse.create({
      data: {
        attemptId,
        questionId,
        responseValue: value,
        userId: req.userId || null,
      },
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// Complete quiz and calculate result
router.post('/complete', async (req: AuthRequest, res) => {
  const { attemptId } = req.body;

  try {
    const responses = await prisma.quizResponse.findMany({
      where: { attemptId },
    });

    const result = calculateArchetype(responses.map(r => ({
      questionId: r.questionId,
      value: r.responseValue
    })));

    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        archetypeResult: result.primary,
        archetypePrimaryScore: result.primaryScore,
        archetypeSecondaryScore: result.secondaryScore,
      },
    });

    res.json({
      attempt: updatedAttempt,
      result
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete quiz' });
  }
});

export default router;

