import { Activity, Github, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-primary" />
            <span>Speed Test Tool - Check your connection speed</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>by Speed Test Team</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Speed Test. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
