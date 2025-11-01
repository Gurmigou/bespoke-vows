import { InvitationData } from "@/pages/Builder";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvitationPreviewProps {
  data: InvitationData;
}

export const InvitationPreview = ({ data }: InvitationPreviewProps) => {
  return (
    <div className="flex-1 bg-muted/30 flex items-center justify-center p-4 lg:p-8">
      <ScrollArea className="h-full w-full max-w-2xl">
        <div 
          className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-500 min-h-[800px]"
          style={{
            backgroundColor: '#F5F3EF',
          }}
        >
          {/* Main Invitation */}
          <div className="p-12 lg:p-16 space-y-12">
            {/* Couple Names */}
            <div className="text-center space-y-6">
              <h1 
                className="text-6xl lg:text-8xl font-serif italic transition-all duration-500"
                style={{ color: data.templateColors.primary }}
              >
                {data.herName} &
                <br />
                {data.hisName}
              </h1>
              
              <div 
                className="w-24 h-px mx-auto transition-all duration-500"
                style={{ backgroundColor: data.templateColors.accent }}
              />
            </div>

            {/* Invitation Text */}
            <div className="text-center space-y-4">
              <p 
                className="text-sm tracking-[0.3em] uppercase transition-all duration-500"
                style={{ color: data.templateColors.text }}
              >
                Запрошуємо на наше весілля
              </p>
              <p 
                className="text-2xl tracking-wide transition-all duration-500"
                style={{ color: data.templateColors.text }}
              >
                {data.weddingDate}
              </p>
            </div>

            {/* Love Story (if provided) */}
            {data.loveStory && (
              <div className="max-w-md mx-auto">
                <p 
                  className="text-center italic leading-relaxed transition-all duration-500"
                  style={{ color: data.templateColors.text }}
                >
                  {data.loveStory}
                </p>
              </div>
            )}

            {/* Venue */}
            <div className="text-center space-y-2">
              <p 
                className="text-xl font-serif transition-all duration-500"
                style={{ color: data.templateColors.primary }}
              >
                {data.weddingPlace.split(',')[0]}
              </p>
              <p 
                className="text-sm uppercase tracking-wider transition-all duration-500"
                style={{ color: data.templateColors.text }}
              >
                {data.weddingPlace.split(',').slice(1).join(',')}
              </p>
            </div>
          </div>

          {/* Order of Events - Page 2 */}
          {data.events.length > 0 && (
            <div className="p-12 lg:p-16 space-y-8 border-t" style={{ borderColor: `${data.templateColors.accent}40` }}>
              <h2 
                className="text-4xl font-serif italic text-center transition-all duration-500"
                style={{ color: data.templateColors.primary }}
              >
                Порядок подій
              </h2>

              <div className="space-y-4 max-w-md mx-auto">
                {data.events.map((event) => (
                  <div 
                    key={event.id}
                    className="flex justify-between items-center py-3 border-b transition-all duration-500"
                    style={{ borderColor: `${data.templateColors.accent}30` }}
                  >
                    <span 
                      className="text-sm tracking-wide transition-all duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {event.time}
                    </span>
                    <span 
                      className="text-sm tracking-widest uppercase transition-all duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {event.eventName}
                    </span>
                  </div>
                ))}
              </div>

              {/* Venue Details */}
              <div className="text-center space-y-4 pt-8">
                <h3 
                  className="text-2xl font-serif italic transition-all duration-500"
                  style={{ color: data.templateColors.primary }}
                >
                  Місце проведення
                </h3>
                <div 
                  className="text-sm uppercase tracking-wider space-y-1 transition-all duration-500"
                  style={{ color: data.templateColors.text }}
                >
                  <p className="font-semibold">{data.weddingPlace.split(',')[0]}</p>
                  <p>{data.weddingPlace.split(',')[1]}</p>
                  <p>{data.weddingPlace.split(',')[2]}</p>
                </div>
                {data.weddingPlace.includes("Розвуд") && (
                  <p 
                    className="text-xs italic pt-4 max-w-sm mx-auto transition-all duration-500"
                    style={{ color: data.templateColors.text }}
                  >
                    Церемонія у саду відбудеться на південній галявині, за якою послідує прийом у великому зимовому саду
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Color Palette Display */}
          {data.weddingColors.length > 0 && (
            <div className="p-8 border-t" style={{ borderColor: `${data.templateColors.accent}40` }}>
              <div className="flex justify-center gap-2">
                {data.weddingColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 transition-all duration-500"
                    style={{ 
                      backgroundColor: color,
                      borderColor: data.templateColors.accent
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
