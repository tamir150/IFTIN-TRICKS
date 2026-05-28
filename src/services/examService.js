import { collection, addDoc, doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const examService = {
  // Mock fetching exams (keeping current logic if it fetches from JSON)
  getExams: async () => {
    const response = await fetch('/exams/exams.json');
    return await response.json();
  },

  getExamById: async (id) => {
    const response = await fetch(`/exams/${id}.json`);
    return await response.json();
  },

  saveQuizResult: async (userId, examId, score, totalQuestions, examTitle) => {
    try {
      // Save detailed result
      await addDoc(collection(db, "results"), {
        userId,
        examId,
        examTitle,
        score,
        totalQuestions,
        percentage: (score / totalQuestions) * 100,
        completedAt: new Date().toISOString()
      });

      // Update user stats
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          score: increment(score * 10), // Example: 10 points per correct answer
          completedExamsCount: increment(1)
        });
      } else {
        // Fallback for guest if profile wasn't created properly
        await setDoc(userRef, {
          uid: userId,
          name: "Guest Student",
          score: score * 10,
          completedExamsCount: 1,
          isAnonymous: true
        });
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      throw error;
    }
  }
};
