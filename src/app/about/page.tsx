import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Facebook, Instagram, Mail, Github, Linkedin, Globe, Users } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  socials: {
    facebook?: string;
    instagram?: string;
    gmail?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Jhon Ryan Solis",
    role: "Developer",
    description: "Leading the technical development and system architecture to ensure a robust and scalable platform.",
    image: "/ryan.jpeg",
    socials: {
      facebook: "https://www.facebook.com/share/18TUnjvie6/",
      instagram: "https://www.instagram.com/ryyyy.aan?igsh=MTZtajNqOXVvd25rcw==",
    }
  },
  {
    name: "Franzel Itulid",
    role: "UI/UX Designer",
    description: "Crafting intuitive and aesthetically pleasing user interfaces that provide a seamless experience for all users.",
    image: "/franzel.jpeg",
    socials: {
      facebook: "https://www.facebook.com/share/1G5sxLDRGu/",
      instagram: "https://www.instagram.com/nunfranzz?igsh=b2I1dHJxbTAwdzN6",
    }
  },
  {
    name: "Wendell Arellano",
    role: "System Tester",
    description: "Meticulously testing every feature to maintain the highest standards of system reliability and performance.",
    image: "/wendell.jpeg",
    socials: {
      facebook: "https://www.facebook.com/share/1CfZ2iGQXf/",
      instagram: "https://www.instagram.com/bshark.z?igsh=MTl2d2E3OGpra2Vjcg==",
    }
  },
  {
    name: "Paul Andrew Tiopes",
    role: "Quality Assurance",
    description: "Executing comprehensive test plans to identify and resolve issues, ensuring a bug-free and stable system.",
    image: "/paul.jpeg",
    socials: {
      facebook: "https://www.facebook.com/share/188988wvv5/",
      instagram: "https://www.instagram.com/pongg_theee_dinosaurr?igsh=dXlhcGZnMmpjczY1",
    }
  }
];

export default async function AboutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300 text-slate-900 dark:text-slate-100">
      <Sidebar username={user.username} role={user.role} avatarUrl={user.avatarUrl} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 pt-32 sm:pt-44 animate-page-fade">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-24">

          <h1 className="text-5xl sm:text-8xl font-black text-gray-900 dark:text-white tracking-tighter mb-8 leading-[0.9]">
            About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent italic pr-3">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 dark:text-slate-400 font-bold text-lg sm:text-xl leading-relaxed">
            The dedicated team behind the <span className="text-blue-600 dark:text-blue-400">Automated Training Report</span> system for DICT Region VI Aklan.
          </p>
        </div>

        {/* Individual Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <div 
              key={i} 
              className="group bg-white dark:bg-slate-900 rounded-[40px] p-2 pb-8 shadow-xl shadow-blue-900/5 dark:shadow-none border border-gray-100 dark:border-slate-800 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] mb-6 bg-gray-100 dark:bg-slate-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info Area */}
              <div className="px-4 xl:px-6 space-y-2">
                <h3 className="text-xl xl:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight whitespace-nowrap">{member.name}</h3>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">{member.role}</p>
                <p className="text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed pt-3">
                  {member.description}
                </p>

                {/* Socials */}
                <div className="mt-8 flex items-center gap-3">
                  {member.socials.facebook && (
                    <a 
                      href={member.socials.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all transform hover:scale-110 shadow-sm shadow-blue-500/10"
                      title="Facebook"
                    >
                      <Facebook size={18} fill="currentColor" />
                    </a>
                  )}
                  {member.socials.instagram && (
                    <a 
                      href={member.socials.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:text-white transition-all transform hover:scale-110 shadow-sm shadow-pink-500/10"
                      title="Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Mission */}
        <div className="mt-20 sm:mt-32 text-center p-10 sm:p-20 rounded-[50px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-1000" />
          
          <div className="relative z-10">
            <h2 className="text-xs font-black mb-8 tracking-[0.4em] uppercase text-gray-400 dark:text-slate-500">The Mission</h2>
            <p className="max-w-3xl mx-auto text-gray-900 dark:text-white text-2xl sm:text-4xl font-black tracking-tighter leading-[1.1]">
              Driven by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic pr-2">Innovation</span>, <br className="hidden sm:block" />
              Committed to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic pr-2">Accuracy</span>.
            </p>
            <p className="max-w-xl mx-auto mt-8 text-gray-500 dark:text-slate-400 font-medium text-lg">
                Empowering the DICT workforce with efficient, reliable, and innovative tools to ensure excellence in every report.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
