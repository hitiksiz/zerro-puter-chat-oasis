
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Chat } from "@/components/Chat";
import { Header } from "@/components/Header";
import { ImageGenerator } from "@/components/ImageGenerator";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="flex-1 container max-w-6xl px-4 py-6 mx-auto">
        <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/30 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                ⚡ Zerro's Chat Oasis
              </CardTitle>
              <ThemeToggle />
            </div>
          </CardHeader>
          
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid grid-cols-2 gap-2 px-4 py-2">
              <TabsTrigger value="chat">
                💬 Chat
              </TabsTrigger>
              <TabsTrigger value="image">
                🖼️ Image Generation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-0 p-0">
              <Chat />
            </TabsContent>
            
            <TabsContent value="image" className="mt-0 p-0">
              <ImageGenerator />
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Powered by Puter API v2 • {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
