import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface LoveStoryFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const LoveStoryForm = ({ data, setData }: LoveStoryFormProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Create a style tag for dynamic accent color
  useEffect(() => {
    const styleId = 'accent-color-textarea-style';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      .accent-focus-ring-textarea:focus-visible {
        --tw-ring-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent} !important;
      }
    `;
  }, [data.templateColors.accent]);

  const handleImageUpload = (file: File, imageKey: 'image1' | 'image2') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setData({
          ...data,
          loveStory: {
            ...data.loveStory,
            [imageKey]: base64String,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image1' | 'image2') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, imageKey);
    }
  };

  const removeImage = (imageKey: 'image1' | 'image2') => {
    setData({
      ...data,
      loveStory: {
        ...data.loveStory,
        [imageKey]: '',
      },
    });
    // Reset file input
    if (imageKey === 'image1' && fileInputRef1.current) {
      fileInputRef1.current.value = '';
    }
    if (imageKey === 'image2' && fileInputRef2.current) {
      fileInputRef2.current.value = '';
    }
  };

  return (
    <div 
      className="border rounded-lg p-4 transition-all duration-500"
      style={{
        borderColor: `${data.templateColors.primary}20`,
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h3 className="text-lg font-semibold">Історія кохання</h3>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 pt-4">
        {/* First Moment */}
        <div className="space-y-3">
          <Label htmlFor="loveStoryMoment1">Перший момент історії</Label>
          
          {/* Image Upload for Moment 1 */}
          <div className="space-y-2">
            <input
              ref={fileInputRef1}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileInputChange(e, 'image1')}
              className="hidden"
              id="image-upload-1"
            />
            {data.loveStory.image1 ? (
              <div className="relative group flex justify-center bg-muted/30 rounded-lg border-2 p-2" style={{ borderColor: `${data.templateColors.accent}40` }}>
                <img
                  src={data.loveStory.image1}
                  alt="Перший момент"
                  className="max-w-full max-h-96 w-auto h-auto object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage('image1')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label htmlFor="image-upload-1">
                <div
                  className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-accent/5"
                  style={{ borderColor: `${data.templateColors.accent}60` }}
                >
                  <Upload className="w-6 h-6 mb-2" style={{ color: data.templateColors.accent }} />
                  <span className="text-sm text-muted-foreground">Завантажити фото</span>
                </div>
              </label>
            )}
          </div>

          <Textarea
            id="loveStoryMoment1"
            value={data.loveStory.moment1}
            onChange={(e) => setData({ ...data, loveStory: { ...data.loveStory, moment1: e.target.value } })}
            placeholder="Розкажіть як ви зустрілися..."
            rows={6}
            className="resize-none accent-focus-ring-textarea"
          />
        </div>
        
        {/* Second Moment */}
        <div className="space-y-3">
          <Label htmlFor="loveStoryMoment2">Другий момент історії</Label>
          
          {/* Image Upload for Moment 2 */}
          <div className="space-y-2">
            <input
              ref={fileInputRef2}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileInputChange(e, 'image2')}
              className="hidden"
              id="image-upload-2"
            />
            {data.loveStory.image2 ? (
              <div className="relative group flex justify-center bg-muted/30 rounded-lg border-2 p-2" style={{ borderColor: `${data.templateColors.accent}40` }}>
                <img
                  src={data.loveStory.image2}
                  alt="Другий момент"
                  className="max-w-full max-h-96 w-auto h-auto object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage('image2')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label htmlFor="image-upload-2">
                <div
                  className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-accent/5"
                  style={{ borderColor: `${data.templateColors.accent}60` }}
                >
                  <Upload className="w-6 h-6 mb-2" style={{ color: data.templateColors.accent }} />
                  <span className="text-sm text-muted-foreground">Завантажити фото</span>
                </div>
              </label>
            )}
          </div>

          <Textarea
            id="loveStoryMoment2"
            value={data.loveStory.moment2}
            onChange={(e) => setData({ ...data, loveStory: { ...data.loveStory, moment2: e.target.value } })}
            placeholder="Розкажіть про пропозицію або інший важливий момент..."
            rows={6}
            className="resize-none accent-focus-ring-textarea"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
    </div>
  );
};
