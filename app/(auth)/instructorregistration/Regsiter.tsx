"use client";

import { InstructorRegistrationform } from "@/components/forms/InstructorRegistrationform";
import React from "react";
import Purpleblulb from "../../../assets/purpleblulb.jpg";
import Image from "next/image";
export default function Register() {
  return (
    <div className="min-h-screen flex items-center pt-16">
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
              Join as an Instructor
            </h1>
            <p className="text-muted-foreground">
              Create your account and start teaching today.
            </p>
          </div>
          <InstructorRegistrationform />
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#56205E] to-[#3A1542] items-center justify-center px-12">
        <div className="flex flex-col items-center flex-1 text-center gap-5 min-h-screen justify-center">
          <div className="hidden md:flex items-center justify-center w-1/3">
            <Image src={Purpleblulb} alt={"Bulb"} className="rounded-2xl " />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Empower the next generation
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Create engaging quizzes, track student progress, and make learning
            interactive. Join fellow educators on YLQ.
          </p>
        </div>
      </div>
    </div>
  );
}
