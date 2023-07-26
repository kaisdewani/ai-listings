"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, CodeIcon, ImageIcon, MessageSquare, MusicIcon, SettingsIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
{
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
},
{
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
},
{
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700",
},
{
    label: "Music",
    icon: MusicIcon,
    href: "/music",
    color: "text-emerald-500",
},
{
    label: "Code Generation",
    icon: CodeIcon,
    href: "/code",
    color: "text-green-500",
},
{
    label: "Settings",
    icon: SettingsIcon,
    href: "/settings",
},
]



const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Real Estate AiO
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
        Unleashing the Future of Home Sales
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
          onClick={()=>(
            router.push(tool.href)
          )}
           key={tool.href}
           className="p-4 boarder-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md")}>
                <tool.icon className={cn("w-8 h-8", tool.color)}/>
              </div>
              <div>
                {tool.label}
              </div>
            </div>
            <ArrowRight className="w-5 h-5"/>
          </Card>
        ))}
      </div>
    </div>

  );
};

export default DashboardPage;
