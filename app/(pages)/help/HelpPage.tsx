"use client";

import {
  BookOpen,
  Play,
  FileQuestion,
  Users,
  LifeBuoy,
  Mail,
} from "lucide-react";
import HelpTopicCard from "@/app/(components)/HelpTopicCard";
import type { HelpTopic } from "@/app/(components)/HelpTopicCard";

const topics: HelpTopic[] = [
  {
    title: "Getting Started",
    description:
      "Learn how to create an account, navigate the dashboard, and take your first quiz.",
    icon: BookOpen,
    content: [
      "To get started, create an account using your email address and choose your role (Student or Instructor).",
      "Once logged in, students can join live quizzes using a session code or take standard quizzes via a quiz code provided by their instructor.",
      "Instructors can create quizzes from the dashboard, publish them, and share the quiz code with students.",
      "Use the sidebar to navigate between Dashboard, Quizzes, History, and other sections.",
    ],
  },
  {
    title: "Taking Quizzes",
    description:
      "How to join live quizzes, take standard quizzes, and understand your results.",
    icon: Play,
    content: [
      "Live Quizzes: Enter the session code from your instructor on the dashboard to join a live quiz. Answer questions in real-time and see the leaderboard.",
      "Standard Quizzes: Enter the quiz code on the dashboard to start a standard self-paced quiz. You can review and submit your answers at the end.",
      "After submitting, you'll see your score, correct answers, and a detailed breakdown of your performance.",
      "You can review past attempts from the History page or from the quiz's intro page.",
    ],
  },
  {
    title: "Managing Quizzes",
    description:
      "Create, edit, publish, and organize your quizzes as an instructor.",
    icon: FileQuestion,
    content: [
      "Navigate to My Quizzes in the sidebar and click 'Create New Quiz' to build a quiz from scratch.",
      "Add questions with multiple choice, true/false, or identification formats. Set points, time limits, and passing scores.",
      "Once ready, publish the quiz to generate a unique quiz code. Share this code with your students.",
      "You can edit or delete quizzes anytime. Published quizzes can be taken by any student with the code.",
    ],
  },
  {
    title: "Live Sessions",
    description:
      "Host live quiz sessions, manage participants, and view leaderboards.",
    icon: Users,
    content: [
      "From any published quiz, click 'Start Live Session' to begin a real-time quiz session.",
      "Students join using the session code displayed on screen. You control when to move to the next question.",
      "View participant progress in real-time. The session ends automatically after the last question.",
      "After the session, review results, scores, and participant performance from the quiz details page.",
    ],
  },
  {
    title: "Account & Settings",
    description:
      "Manage your profile, password, notification preferences, and connected instructors.",
    icon: LifeBuoy,
    content: [
      "View your profile details including name, email, and role from the Profile page.",
      "Students can connect with instructors using an invite code to see their published quizzes on the dashboard.",
      "Manage your notification preferences and account settings from the Settings page.",
      "Use the Help Center or contact support if you need further assistance.",
    ],
  },
  {
    title: "Contact Support",
    description: "Reach out to our support team for further assistance.",
    icon: Mail,
    content: [
      "If you're experiencing issues or have questions not covered here, our support team is ready to help.",
      "Email us at support@example.com with your account details and a description of the issue.",
      "We aim to respond within 24 hours during business days.",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-0 w-full mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-card-foreground">Help Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find answers to common questions and learn how to use the platform.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 items-start">
        {topics.map((topic) => (
          <HelpTopicCard key={topic.title} topic={topic} />
        ))}
      </div>

      <div className="mt-10 p-6 rounded-xl border border-border bg-muted text-center">
        <p className="text-sm text-muted-foreground">
          Still need help?{" "}
          <a
            href="mailto:snathaniellucero202100494@gmail.com"
            className="text-[#56205E] font-medium hover:underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
