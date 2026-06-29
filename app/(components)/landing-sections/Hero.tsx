import Image from "next/image";
import Link from "next/link";
import React from "react";
import Purpleblulb from "../../../assets/purpleblulb.jpg";
export default function Hero() {
  return (
    <section className="relative flex-1 flex items-center overflow-hidden bg-gradient-to-br from-[#56205E] to-[#3A1542] min-h-screen py-20">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#7B2D8A] rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#9B3DAA] rounded-full opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-12 w-full">
        <div className="flex justify-around items-center">
          <div className="flex flex-col flex-1">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Learn Together,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-200">
                Live & Interactive
              </span>
            </h1>
            <p className="text-lg text-purple-200 mb-10 leading-relaxed max-w-xl">
              Join real-time quizzes, challenge your knowledge, and compete with
              peers. Whether you&apos;re a student or an instructor, YLQ makes
              learning engaging and fun.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/studentregistration"
                className="bg-white text-[#56205E] font-semibold rounded-full px-8 py-3 hover:bg-purple-100 transition shadow-lg"
              >
                Start Learning
              </Link>
              <Link
                href="/instructorregistration"
                className="border-2 border-white text-white font-semibold rounded-full px-8 py-3 hover:bg-white hover:text-[#56205E] transition"
              >
                Teach on YLQ
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-1/3">
            <Image src={Purpleblulb} alt={"Bulb"} className="rounded-2xl " />
          </div>
        </div>
      </div>

      {/* Decorative dots */}
      <div className="absolute bottom-12 left-12 flex gap-3">
        <div className="w-2 h-2 bg-purple-300 rounded-full opacity-60" />
        <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40" />
        <div className="w-2 h-2 bg-purple-300 rounded-full opacity-20" />
      </div>
    </section>
  );
}
