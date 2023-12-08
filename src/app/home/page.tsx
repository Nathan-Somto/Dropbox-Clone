import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate()
  return (
    <div>
      <header className="flex px-10 py-8 text-white items-center gap-20 bg-[#2b2929] dark:bg-slate-800 flex-col lg:flex-row">
        <div>
          <h1 className="text-2xl leading-[1.4] font-bold mb-6">
            <span className="block text-5xl mb-5">Welcome To DropBox</span>
            <span>
              Get business tasks done effortlessly with all your essentials in
              one place.
            </span>
          </h1>
          <p className="mb-9">
            Collaborate effortlessly and accelerate work delivery from anywhere
            using Dropbox. Safely store your content, edit PDFs, share videos,
            sign documents, and monitor file engagement—all within the Dropbox
            platform.
          </p>
          <Button
            className="bg-[#0160fe] text-white py-7 text-lg font-semibold"
            size={"lg"}
            onClick={() => navigate('/sign-in')}
          >
            Try it for Free!
            <ArrowRight className="ml-6" />
          </Button>
        </div>
        <div className="dark:bg-slate-900 rounded-md h-[300px]  bg-[#1e1919] p-10">
          <video
            aria-hidden="false"
            aria-label="video player"
            autoPlay
            playsInline
            loop
            muted
            className="rounded-lg"
          >
            <source src="" type="video/quicktime; codecs=hvc1" />
            <source src="" type="video/webm; codecs=vp9" />
            <source
              src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </header>
      <section className="mt-10 font-light pb-6 text-center">
        <h1 className="text-3xl mb-3 font-semibold">Things to Note!</h1>
        <p className="mb-2">
          This is a very simple replica of dropbox, currently the project has a
          max cap of <span className="font-bold">5</span> users who are limited
          to just <code>200mb</code> of storage.
        </p>
        <p>
          I just did this project for fun and i have no plans of marketing this
          out to anyone!
        </p>
      </section>
      <footer className="dark:bg-slate-600 bg-slate-300 mt-5 border-t border-solid py-2 px-3 text-primary-white text-center">
        <p>
          Created by{" "}
          <a
            href="https://github.com/Nathan-Somto"
            className=" font-semibold"
            target="_blank"
          >
            Nathan Somto
          </a>{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
