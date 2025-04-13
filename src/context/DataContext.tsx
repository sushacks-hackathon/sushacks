import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Types
interface InternshipData {
  id: string;
  company: string;
  role: string;
  period: string;
  mode: 'offline' | 'online';
  description: string;
  applyLink: string;
}

interface JobData {
  id: string;
  company: string;
  role: string;
  mode: 'offline' | 'online' | 'hybrid';
  description: string;
  applyLink: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  url?: string;
  type: 'interview' | 'drive' | 'deadline' | 'reminder';
  status: 'upcoming' | 'completed' | 'past';
  reminders: {
    id: string;
    time: string;
    triggered: boolean;
  }[];
}

interface CompanyReview {
  id: string;
  userId: string;
  username: string;
  company: string;
  position: string;
  positionType: 'internship' | 'job';
  rating: number;
  review: string;
  timestamp: string;
  likes: string[];
  dislikes: string[];
}

interface DiscussionPost {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  timestamp: string;
  likes: string[];
  replies: {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: string;
    likes: string[];
  }[];
}

interface Resource {
  id: string;
  title: string;
  type: 'mock-test' | 'ai-quiz';
  description: string;
  link: string;
}

type DataContextType = {
  internships: InternshipData[];
  jobs: JobData[];
  savedInternships: string[];
  savedJobs: string[];
  calendarEvents: CalendarEvent[];
  companyReviews: CompanyReview[];
  discussionPosts: DiscussionPost[];
  resources: Resource[];
  saveInternship: (id: string) => void;
  unsaveInternship: (id: string) => void;
  saveJob: (id: string) => void;
  unsaveJob: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  addCompanyReview: (review: Omit<CompanyReview, 'id' | 'timestamp' | 'userId' | 'username' | 'likes' | 'dislikes'>) => void;
  toggleReviewLike: (reviewId: string) => void;
  toggleReviewDislike: (reviewId: string) => void;
  addDiscussionPost: (post: Omit<DiscussionPost, 'id' | 'timestamp' | 'userId' | 'username' | 'likes' | 'replies'>) => void;
  addDiscussionReply: (postId: string, content: string) => void;
  togglePostLike: (postId: string) => void;
  toggleReplyLike: (postId: string, replyId: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Generate mock data
const generateMockInternships = (): InternshipData[] => {
  const companies = ['Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple', 'Netflix', 'Tesla', 'Twitter', 'Adobe', 'IBM'];
  const roles = ['Software Engineer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer', 'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'];
  const periods = ['2 months', '3 months', '6 months', 'Summer 2025', 'Winter 2025'];
  const modes = ['offline', 'online'];
  
  return Array(30).fill(null).map((_, index) => ({
    id: `internship-${index}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    period: periods[Math.floor(Math.random() * periods.length)],
    mode: modes[Math.floor(Math.random() * modes.length)] as 'offline' | 'online',
    description: `This is an exciting internship opportunity at a leading tech company. Join our team and gain valuable experience in a dynamic environment.`,
    applyLink: 'https://example.com/apply'
  }));
};

const generateMockJobs = (): JobData[] => {
  const companies = ['Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple', 'Netflix', 'Tesla', 'Twitter', 'Adobe', 'IBM'];
  const roles = ['Software Engineer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer', 'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'];
  const modes = ['offline', 'online', 'hybrid'];
  
  return Array(30).fill(null).map((_, index) => ({
    id: `job-${index}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    mode: modes[Math.floor(Math.random() * modes.length)] as 'offline' | 'online' | 'hybrid',
    description: `Join our team as a full-time employee and work on cutting-edge technology that impacts millions of users worldwide.`,
    applyLink: 'https://example.com/apply'
  }));
};

const generateMockResources = (): Resource[] => {
  const mockTests = [
    { title: 'Data Structures & Algorithms Test', description: 'Test your knowledge of fundamental algorithms and data structures.' },
    { title: 'System Design Mock Interview', description: 'Practice designing scalable systems in this mock interview.' },
    { title: 'Java Programming Assessment', description: 'Test your Java programming skills with this comprehensive assessment.' },
    { title: 'Frontend Development Challenge', description: 'Solve real-world frontend development problems in this timed test.' },
    { title: 'SQL Query Mastery Test', description: 'Test your SQL query writing and database knowledge.' },
    { title: 'Python Coding Challenge', description: 'Solve algorithmic problems using Python in this timed challenge.' },
    { title: 'Object-Oriented Programming Test', description: 'Evaluate your understanding of OOP concepts and implementation.' },
    { title: 'Web Development Fundamentals', description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals.' },
    { title: 'Machine Learning Concepts Test', description: 'Evaluate your understanding of machine learning algorithms and applications.' },
    { title: 'Behavioral Interview Simulator', description: 'Practice responding to common behavioral interview questions.' }
  ];
  
  const aiQuizzes = [
    { title: 'AI-Generated DSA Problems', description: 'Dynamically generated algorithm problems tailored to your skill level.' },
    { title: 'Adaptive Coding Quiz', description: 'AI-powered quiz that adapts to your strengths and weaknesses in coding.' },
    { title: 'Interview Question Generator', description: 'AI generates realistic interview questions based on your target company.' },
    { title: 'Personalized System Design Challenges', description: 'AI creates system design scenarios based on your experience level.' },
    { title: 'Language-Specific Coding Challenges', description: 'AI generates coding problems optimized for your preferred programming language.' },
    { title: 'Technical Communication Assessment', description: 'AI evaluates your ability to explain technical concepts clearly.' },
    { title: 'Problem-Solving Strategy Quiz', description: 'Test your approach to solving novel problems with this AI-powered quiz.' },
    { title: 'Code Review Simulator', description: 'AI presents code with bugs and inefficiencies for you to identify and fix.' },
    { title: 'Debugging Challenge', description: 'AI generates broken code for you to debug and fix within a time limit.' },
    { title: 'Full-Stack Development Quiz', description: 'Test your knowledge across the entire development stack with this AI quiz.' }
  ];
  
  return [
    ...mockTests.map((test, index) => ({
      id: `mock-test-${index}`,
      title: test.title,
      type: 'mock-test' as const,
      description: test.description,
      link: 'https://example.com/test'
    })),
    ...aiQuizzes.map((quiz, index) => ({
      id: `ai-quiz-${index}`,
      title: quiz.title,
      type: 'ai-quiz' as const,
      description: quiz.description,
      link: 'https://example.com/quiz'
    }))
  ];
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize state
  const [internships] = useState<InternshipData[]>(generateMockInternships());
  const [jobs] = useState<JobData[]>(generateMockJobs());
  const [resources] = useState<Resource[]>(generateMockResources());
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [companyReviews, setCompanyReviews] = useState<CompanyReview[]>([]);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      // Fetch saved internships from Supabase profiles table
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('saved_internships')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }
          
          if (data?.saved_internships) {
            setSavedInternships(data.saved_internships);
          }
          
          // Load saved jobs
          const users = JSON.parse(localStorage.getItem('ipdriveUsers') || '[]');
          const currentUser = users.find((u: any) => u.id === user.id);
          
          if (currentUser) {
            setSavedJobs(currentUser.savedJobs || []);
            
            // Load calendar events
            const storedEvents = localStorage.getItem(`ipdriveEvents-${user.id}`);
            if (storedEvents) {
              setCalendarEvents(JSON.parse(storedEvents));
            }
            
            // Load company reviews if they exist
            const storedReviews = localStorage.getItem('ipdriveCompanyReviews');
            if (storedReviews) {
              setCompanyReviews(JSON.parse(storedReviews));
            }
            
            // Load discussion posts if they exist
            const storedPosts = localStorage.getItem('ipdriveDiscussionPosts');
            if (storedPosts) {
              setDiscussionPosts(JSON.parse(storedPosts));
            }
          }
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      };
      
      fetchUserProfile();
    } else {
      // Clear user-specific data when logged out
      setSavedInternships([]);
      setSavedJobs([]);
      setCalendarEvents([]);
    }
  }, [user]);

  // Helper to update user data in localStorage
  const updateUserData = (updates: any) => {
    if (!user) return;
    
    // For saved jobs, we still use localStorage
    const users = JSON.parse(localStorage.getItem('ipdriveUsers') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('ipdriveUsers', JSON.stringify(users));
    }
  };

  // CRUD operations for saved internships using Supabase
  const saveInternship = async (id: string) => {
    if (!user) return;
    
    const newSaved = [...savedInternships, id];
    setSavedInternships(newSaved);
    
    // Update in Supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ saved_internships: newSaved })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error saving internship:', error);
        // Revert state if Supabase update fails
        setSavedInternships(savedInternships);
      }
    } catch (err) {
      console.error('Error saving internship:', err);
      setSavedInternships(savedInternships);
    }
  };

  const unsaveInternship = async (id: string) => {
    if (!user) return;
    
    const newSaved = savedInternships.filter(i => i !== id);
    setSavedInternships(newSaved);
    
    // Update in Supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ saved_internships: newSaved })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error unsaving internship:', error);
        // Revert state if Supabase update fails
        setSavedInternships(savedInternships);
      }
    } catch (err) {
      console.error('Error unsaving internship:', err);
      setSavedInternships(savedInternships);
    }
  };

  const saveJob = (id: string) => {
    if (!user) return;
    const newSaved = [...savedJobs, id];
    setSavedJobs(newSaved);
    updateUserData({ savedJobs: newSaved });
  };

  const unsaveJob = (id: string) => {
    if (!user) return;
    const newSaved = savedJobs.filter(j => j !== id);
    setSavedJobs(newSaved);
    updateUserData({ savedJobs: newSaved });
  };

  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) return;
    
    const newEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedEvents = [...calendarEvents, newEvent];
    setCalendarEvents(updatedEvents);
    localStorage.setItem(`ipdriveEvents-${user.id}`, JSON.stringify(updatedEvents));
  };

  const updateCalendarEvent = (updatedEvent: CalendarEvent) => {
    if (!user) return;
    
    const updatedEvents = calendarEvents.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    setCalendarEvents(updatedEvents);
    localStorage.setItem(`ipdriveEvents-${user.id}`, JSON.stringify(updatedEvents));
  };

  const deleteCalendarEvent = (id: string) => {
    if (!user) return;
    
    const updatedEvents = calendarEvents.filter(event => event.id !== id);
    setCalendarEvents(updatedEvents);
    localStorage.setItem(`ipdriveEvents-${user.id}`, JSON.stringify(updatedEvents));
  };

  const addCompanyReview = (reviewData: Omit<CompanyReview, 'id' | 'timestamp' | 'userId' | 'username' | 'likes' | 'dislikes'>) => {
    if (!user) return;
    
    const newReview = {
      ...reviewData,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      likes: [],
      dislikes: []
    };
    
    const updatedReviews = [...companyReviews, newReview];
    setCompanyReviews(updatedReviews);
    localStorage.setItem('ipdriveCompanyReviews', JSON.stringify(updatedReviews));
  };

  const toggleReviewLike = (reviewId: string) => {
    if (!user) return;
    
    const updatedReviews = companyReviews.map(review => {
      if (review.id === reviewId) {
        const userLiked = review.likes.includes(user.id);
        const userDisliked = review.dislikes.includes(user.id);
        
        let likes = [...review.likes];
        let dislikes = [...review.dislikes];
        
        if (userLiked) {
          // Remove like if already liked
          likes = likes.filter(id => id !== user.id);
        } else {
          // Add like and remove from dislikes if present
          likes.push(user.id);
          dislikes = dislikes.filter(id => id !== user.id);
        }
        
        return { ...review, likes, dislikes };
      }
      return review;
    });
    
    setCompanyReviews(updatedReviews);
    localStorage.setItem('ipdriveCompanyReviews', JSON.stringify(updatedReviews));
  };

  const toggleReviewDislike = (reviewId: string) => {
    if (!user) return;
    
    const updatedReviews = companyReviews.map(review => {
      if (review.id === reviewId) {
        const userLiked = review.likes.includes(user.id);
        const userDisliked = review.dislikes.includes(user.id);
        
        let likes = [...review.likes];
        let dislikes = [...review.dislikes];
        
        if (userDisliked) {
          // Remove dislike if already disliked
          dislikes = dislikes.filter(id => id !== user.id);
        } else {
          // Add dislike and remove from likes if present
          dislikes.push(user.id);
          likes = likes.filter(id => id !== user.id);
        }
        
        return { ...review, likes, dislikes };
      }
      return review;
    });
    
    setCompanyReviews(updatedReviews);
    localStorage.setItem('ipdriveCompanyReviews', JSON.stringify(updatedReviews));
  };

  const addDiscussionPost = (postData: Omit<DiscussionPost, 'id' | 'timestamp' | 'userId' | 'username' | 'likes' | 'replies'>) => {
    if (!user) return;
    
    const newPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      likes: [],
      replies: []
    };
    
    const updatedPosts = [...discussionPosts, newPost];
    setDiscussionPosts(updatedPosts);
    localStorage.setItem('ipdriveDiscussionPosts', JSON.stringify(updatedPosts));
  };

  const addDiscussionReply = (postId: string, content: string) => {
    if (!user) return;
    
    const updatedPosts = discussionPosts.map(post => {
      if (post.id === postId) {
        const newReply = {
          id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          username: user.username,
          content,
          timestamp: new Date().toISOString(),
          likes: []
        };
        
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    });
    
    setDiscussionPosts(updatedPosts);
    localStorage.setItem('ipdriveDiscussionPosts', JSON.stringify(updatedPosts));
  };

  const togglePostLike = (postId: string) => {
    if (!user) return;
    
    const updatedPosts = discussionPosts.map(post => {
      if (post.id === postId) {
        const userLiked = post.likes.includes(user.id);
        
        let likes = [...post.likes];
        if (userLiked) {
          likes = likes.filter(id => id !== user.id);
        } else {
          likes.push(user.id);
        }
        
        return { ...post, likes };
      }
      return post;
    });
    
    setDiscussionPosts(updatedPosts);
    localStorage.setItem('ipdriveDiscussionPosts', JSON.stringify(updatedPosts));
  };

  const toggleReplyLike = (postId: string, replyId: string) => {
    if (!user) return;
    
    const updatedPosts = discussionPosts.map(post => {
      if (post.id === postId) {
        const updatedReplies = post.replies.map(reply => {
          if (reply.id === replyId) {
            const userLiked = reply.likes.includes(user.id);
            
            let likes = [...reply.likes];
            if (userLiked) {
              likes = likes.filter(id => id !== user.id);
            } else {
              likes.push(user.id);
            }
            
            return { ...reply, likes };
          }
          return reply;
        });
        
        return { ...post, replies: updatedReplies };
      }
      return post;
    });
    
    setDiscussionPosts(updatedPosts);
    localStorage.setItem('ipdriveDiscussionPosts', JSON.stringify(updatedPosts));
  };

  return (
    <DataContext.Provider value={{
      internships,
      jobs,
      savedInternships,
      savedJobs,
      calendarEvents,
      companyReviews,
      discussionPosts,
      resources,
      saveInternship,
      unsaveInternship,
      saveJob,
      unsaveJob,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
      addCompanyReview,
      toggleReviewLike,
      toggleReviewDislike,
      addDiscussionPost,
      addDiscussionReply,
      togglePostLike,
      toggleReplyLike
    }}>
      {children}
    </DataContext.Provider>
  );
};
