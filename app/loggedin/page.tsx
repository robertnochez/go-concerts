import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import SpotifyLogin from "@/components/spotify/spotify-auth";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default function Home() {
  const {userId} = auth()
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <SpotifyLogin />
          <UserButton />

          {
            userId
          }
        </main>
      </div>
    </div>
  );
}
