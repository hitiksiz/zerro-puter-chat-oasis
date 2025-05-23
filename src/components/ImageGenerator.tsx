
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Image, Download } from "lucide-react";
import { toast } from "sonner";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(true);
  
  const generateImage = async () => {
    const finalPrompt = prompt.trim() || "A picture of a cat";
    
    try {
      // Check auth first
      if (!window.puter || !(await window.puter.auth.isSignedIn())) {
        toast.error("Please sign in to generate images! 🔑");
        return;
      }
      
      setIsGenerating(true);
      setImageUrl(null);
      
      toast.info(`🖼️ Generating image: "${finalPrompt}"${testMode ? " (Test Mode)" : ""}`);
      
      const imgElement = await window.puter.ai.txt2img(finalPrompt, testMode);
      
      // Extract and store the image URL from the element
      if (imgElement && imgElement.src) {
        setImageUrl(imgElement.src);
        toast.success("Image generated successfully! ✨");
      } else {
        throw new Error("Generated image has no valid source");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image downloaded successfully! 📥");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };
  
  return (
    <div className="p-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Image Prompt</Label>
          <div className="flex gap-2">
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              disabled={isGenerating}
            />
            <Button onClick={generateImage} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Image className="h-4 w-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Label htmlFor="test-mode" className="cursor-pointer">
              <input
                id="test-mode"
                type="checkbox"
                className="mr-2"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
              />
              Test Mode (Faster, Lower Quality)
            </Label>
          </div>
        </div>

        <div className="image-result flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-pulse text-xl">✨</div>
                <p className="text-muted-foreground">Generating your image...</p>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="image-container w-full flex flex-col items-center gap-4">
              <img 
                src={imageUrl} 
                alt="Generated image" 
                className="max-w-full rounded-md overflow-hidden shadow-lg"
              />
              
              <Button 
                variant="outline" 
                onClick={downloadImage} 
                className="mt-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
            </div>
          ) : (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl">🖼️</div>
                <p className="text-muted-foreground">Your image will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
