"use client";

import { getSessionParticipants, getSessionStatus } from "@/actions/client/quiz.action";
import { useEffect, useRef, useState } from "react";

export type Participant = {
  id: string;
  userId: string;
  name: string;
  email: string;
  joinedAt: string;
  score: number | null;
};

export type SessionStatus = {
  isActive: boolean;
  cancelled: boolean;
  currentQuestion: number | null;
  startedAt: Date | null;
  endedAt: Date | null;
};

export function usePollSession(
  sessionId: string,
  initialParticipants?: Participant[]
) {
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants ?? []
  );
  const [status, setStatus] = useState<SessionStatus>({
    isActive: true,
    cancelled: false,
    currentQuestion: null,
    startedAt: null,
    endedAt: null,
  });
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    cancelledRef.current = false;

    async function poll() {
      if (cancelledRef.current) return;
      const [participantsData, sessionData] = await Promise.all([
        getSessionParticipants(sessionId),
        getSessionStatus(sessionId),
      ]);

      if (cancelledRef.current) return;

      setParticipants(participantsData);

      if (sessionData) {
        setStatus({
          isActive: sessionData.isActive,
          cancelled: sessionData.cancelled,
          currentQuestion: sessionData.currentQuestion,
          startedAt: sessionData.startedAt,
          endedAt: sessionData.endedAt,
        });
      }
    }

    poll();
    const interval = setInterval(poll, 3000);

    return () => {
      cancelledRef.current = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  return { participants, status };
}
