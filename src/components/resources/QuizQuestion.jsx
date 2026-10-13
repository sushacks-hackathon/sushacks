import React, { useState } from 'react';


export const QuizQuestion = ({ questionNumber, question }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectAnswer = (option) => {
    setSelectedAnswer(option);
    setShowExplanation(true);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;
  
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start gap-3">
          <div className="bg-muted text-foreground font-medium h-6 w-6 rounded-full flex items-center justify-center text-sm">
            {questionNumber}
          </div>
          <div className="space-y-4 flex-1">
            <h3 className="font-medium text-lg">{question.question}</h3>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start text-left font-normal h-auto py-3 px-4 ${
                    selectedAnswer === option
                      ? option === question.correctAnswer
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-red-500 bg-red-50 text-red-900"
                      : ""
                  }`}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1">{option}</div>
                    {selectedAnswer === option && (
                      <div>
                        {option === question.correctAnswer ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      {showExplanation && (
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">
                {isCorrect ? (
                  <span className="text-green-600">Correct!</span>
                ) : (
                  <span className="text-red-600">Incorrect</span>
                )}
              </h4>
              {!isCorrect && (
                <p className="text-sm">
                  Correct answer: <span className="font-medium">{question.correctAnswer}</span>
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};