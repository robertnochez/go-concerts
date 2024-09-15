"use client";
import { signInAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import todovexLogo from "@/public/logo/todovex.svg";
import clsx from "clsx";
import { Loader, StepForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import axios from 'axios';

import { useFormStatus } from "react-dom";

export default function LoginForm() { 
  return (
    <main className="bg-gradient-to-r from-purple-200 to-orange-200 h-full min-h-screen">
      <div className="container relative m-0 mx-auto py-10 md:px-10">
        <div className="max-width flex items-center justify-center lg:justify-between">
          <Link className="flex items-center gap-1" href="/loggedin">
            <Image
              src={todovexLogo}
              width="50"
              height="50"
              alt="logo"
              className="h-16 w-20 md:h-16 md:w-20"
            />
            <h1 className="text-xl hidden lg:flex font-medium text-gray-950 md:text-3xl">
              goConcerts
            </h1>
          </Link>
          <div className="hidden lg:flex w-fit items-center">
            <form action={signInAction}>
              <NextPageButton />
            </form>
          </div>
        </div>
        <div className="w-full px-4 pt pt-12 md:px-4 lg:px-8 xl:px-10 2xl:px-0">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="">
              <div className="flex items-center justify-center py-12">
                <Image
                  alt="mobile"
                  loading="lazy"
                  width="250"
                  height="300"
                  className="z-10 max-w-[400px]"
                  src={"/waveform.png"}
                />
                {/* <Image
                  src="/waveform.png"
                  alt="laptop"
                  loading="lazy"
                  width="1000"
                  height="500"
                  data-nimg="1"
                  className="h-full -ml-28 mt-10 hidden lg:flex"
                /> */}
              </div>
            </div>
            <h1 className="inline-block text-center text-4xl font-medium tracking-tighter text-dark lg:text-7xl">
              find concerts near you{" "}
              {/* <br className="hidden lg:inline-block" />
              Todoist Clone */}
            </h1>
            <h2 className="mt-8 text-center text-xl font-light tracking-tight lg:text-3xl italic">
              goConcerts seamlessly{" "}
              <span className="font-bold px-1">compares ticket prices</span> and
              <br className="hidden lg:inline-block" />
              <span className="font-bold px-1">suggests music matches</span>
              using AI.
            </h2>
            <div className="mt-12 flex flex-col gap-4">  
              <SearchBar /> 
              {/* <form action={signInAction}>
                <GetStartedButton />
                <NextPageButton />
              </form>
              <div className="w-fit items-center">
                <Button
                  className="text-xl text-center px-4 py-7 bg-transparent border-purple-500/50"
                  variant={"outline"}
                >
                  Star on Github ⭐️
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function GetStartedButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="flex items-center justify-center px-8 py-4 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-100 rounded-xl group bg-gradient-to-br from-purple-600 to-orange-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-blue-800"
    >
      <span className="flex items-center gap-1">
        {pending ? (
          <span className=" px-16">
            <Loader className="w-5 h-5" />
          </span>
        ) : (
          <>
            Get Started
            <StepForward />
          </>
        )}
      </span>
    </button>
  );
}

function NextPageButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="flex items-center justify-center px-8 py-4 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-100 rounded-xl group bg-gradient-to-br from-purple-600 to-orange-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-blue-800"
    >
      <span className="flex items-center gap-1">
        {pending ? (
          <span className=" px-16">
            <Loader className="w-5 h-5" />
          </span>
        ) : (
          <>
            Get Started
            <StepForward />
          </>
        )}
      </span>
    </button>
  );
}

function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <Link href={"/signIn"}>
      <button
        disabled={pending}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span
          className={clsx(
            "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0",
            pending && "px-16"
          )}
        >
          {pending ? (
            <span className="">
              <Loader className="w-5 h-5" />
            </span>
          ) : (
            "Sign in"
          )}
        </span>
      </button>
    </Link>

  );
}

function SearchBar() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/products/search?q=${value}`
        );

        setSuggestions(data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [value]);

  return (
    <div className="px-24">
      <input
        type="text"
        className="py-2 px-4 w-96 rounded-sm"
        placeholder="Search events, artists, teams, and more..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};
