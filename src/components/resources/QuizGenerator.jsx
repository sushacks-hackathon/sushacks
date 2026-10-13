import { useState } from "react";
import { QuizQuestion } from "./QuizQuestion";

export const QuizGenerator = () => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [questionCount, setQuestionCount] = useState([5]); // Default to 5 questions
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleGenerateQuiz = async () => {
    if (!company || !role || !skills) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before generating a quiz.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // For demo purposes, we'll create a mock quiz
    // In a real application, this would make an API call to your backend
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Large pool of potential questions to simulate non-repeating questions
      const questionPool = [
        {
          question: "What is a key advantage of using Node.js for backend development?",
          options: [
            "Strong typing system",
            "Non-blocking I/O operations",
            "Automatic memory management",
            "Built-in ORM"
          ],
          correctAnswer: "Non-blocking I/O operations",
          explanation: "Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications."
        },
        {
          question: "Which of the following is NOT a valid way to create indexes in MongoDB?",
          options: [
            "db.collection.createIndex({ field: 1 })",
            "db.collection.index({ field: 1 })",
            "db.collection.ensureIndex({ field: 1 })",
            "Using the MongoDB Compass GUI"
          ],
          correctAnswer: "db.collection.index({ field: 1 })",
          explanation: "The correct methods are createIndex() (current), ensureIndex() (deprecated), or using GUI tools like MongoDB Compass."
        },
        {
          question: "In REST API design, which HTTP method should be used to update an existing resource?",
          options: [
            "GET",
            "POST",
            "PUT",
            "DELETE"
          ],
          correctAnswer: "PUT",
          explanation: "PUT is used to update existing resources, while POST is typically used to create new resources."
        },
        {
          question: "What is the purpose of the \"key\" prop in React lists?",
          options: [
            "To provide accessibility features",
            "To help React identify which items have changed, added, or removed",
            "To enable component styling",
            "To trigger re-renders on demand"
          ],
          correctAnswer: "To help React identify which items have changed, added, or removed",
          explanation: "Keys help React identify which items have changed, added, or removed, which helps make the rendering process more efficient."
        },
        {
          question: "Which CSS property is used to create space between flex items?",
          options: [
            "flex-space",
            "gap",
            "margin",
            "space-between"
          ],
          correctAnswer: "gap",
          explanation: "The gap property defines the spacing between flex items. Although margin can be used too, gap is specifically designed for this purpose."
        },
        {
          question: "What does the \"useCallback\" hook do in React?",
          options: [
            "Creates a memoized callback that only changes if dependencies change",
            "Registers a callback to run after component unmounts",
            "Manages form validation callbacks",
            "Handles error boundaries"
          ],
          correctAnswer: "Creates a memoized callback that only changes if dependencies change",
          explanation: "useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed, useful for optimizing performance."
        },
        {
          question: "Which of these is NOT a valid HTTP status code?",
          options: [
            "201 Created",
            "301 Moved Permanently",
            "420 Enhance Your Calm",
            "501 Not Implemented"
          ],
          correctAnswer: "420 Enhance Your Calm",
          explanation: "While 420 has been used by some services as a non-standard status code, it's not part of the official HTTP specification."
        },
        {
          question: "What is CORS in web development?",
          options: [
            "A CSS framework",
            "A protocol for secure data transmission",
            "A mechanism that allows restricted resources to be requested from another domain",
            "A JavaScript runtime environment"
          ],
          correctAnswer: "A mechanism that allows restricted resources to be requested from another domain",
          explanation: "Cross-Origin Resource Sharing (CORS) is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the original page."
        },
        {
          question: "Which statement about JavaScript promises is TRUE?",
          options: [
            "Promises can only be in a pending state",
            "A promise can be both fulfilled and rejected at the same time",
            "The .then() method returns a new promise",
            "Promises can only handle a single asynchronous operation"
          ],
          correctAnswer: "The .then() method returns a new promise",
          explanation: "The .then() method returns a new promise, which allows for promise chaining."
        },
        {
          question: "What is the Big O notation of binary search?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n²)"
          ],
          correctAnswer: "O(log n)",
          explanation: "Binary search has a time complexity of O(log n) because it divides the search interval in half with each iteration."
        }
      ];
      
      // Randomly select the requested number of questions
      const selectedQuestions = questionPool
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, Math.min(questionCount[0], questionPool.length)); // Take requested number or max available
      
      setQuestions(selectedQuestions);
      toast({
        title: "Quiz generated!",
        description: `Created a quiz for ${role} at ${company} with ${selectedQuestions.length} questions.`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate quiz",
        description: "There was an error generating your quiz. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestions([]);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>AI Quiz Generator</CardTitle>
          <CardDescription>
            Generate custom interview questions based on company and role requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input 
                id="company" 
                placeholder="e.g., Google, Microsoft, etc." 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Job Role</Label>
              <Input 
                id="role" 
                placeholder="e.g., Frontend Developer" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills (comma separated)</Label>
            <Input 
              id="skills" 
              placeholder="e.g., React, TypeScript, CSS" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="question-count">Number of Questions</Label>
              <span className="text-sm text-muted-foreground font-medium">
                {questionCount[0]} questions
              </span>
            </div>
            <Slider 
              id="question-count"
              min={1}
              max={20}
              step={1}
              value={questionCount}
              onValueChange={setQuestionCount}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {questions.length > 0 && (
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          <Button onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </CardFooter>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Quiz</h2>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <QuizQuestion
                key={index}
                questionNumber={index + 1}
                question={question}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};