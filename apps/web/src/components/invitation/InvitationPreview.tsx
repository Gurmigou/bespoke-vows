import { useState, useEffect } from "react";
import { InvitationData } from "@/pages/Builder";
import countdownBg from "@/img/countdown-bg.jpg";
import storyPhoto1 from "@/img/story-photo-1.jpg";
import storyPhoto2 from "@/img/story-photo-2.jpg";

interface InvitationPreviewProps {
    data: InvitationData;
  }

export const InvitationPreview = ({ data }: InvitationPreviewProps) => {
    // Wedding Countdown Logic - Parse the wedding date from data
    const parseWeddingDate = (dateString: string) => {
      // Try to create a date object from the string
      // Default to a future date if parsing fails
      const parsed = new Date(dateString);
      if (isNaN(parsed.getTime())) {
        return new Date("2025-06-15T16:00:00");
      }
      return parsed;
    };

    const weddingDate = parseWeddingDate(data.weddingDate);
    
    const calculateTimeLeft = () => {
      const difference = weddingDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [data.weddingDate]);

    // Love Story Data - Use from data prop
    const storyMoments = [
      {
        image: data.loveStory.image1 || storyPhoto1,
        text: data.loveStory.moment1,
        reverse: false,
      },
      {
        image: data.loveStory.image2 || storyPhoto2,
        text: data.loveStory.moment2,
        reverse: true,
      },
    ];

    // Wedding Colours Data - Use from data prop
    const colours = data.weddingColors.map((hex, index) => ({
      name: `Колір ${index + 1}`,
      hex: hex,
    }));

    return (
        <>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&family=Great+Vibes&display=swap');
            .great-vibes-regular {
              font-family: "Great Vibes", cursive;
              font-weight: 400;
              font-style: normal;
            }
          `}
        </style>
        <div
          className="h-screen overflow-y-auto"
          style={{
            // Editorial Wedding Invitation Design System
            '--background': '40 50% 97%',
            '--foreground': '0 0% 15%',
            '--card': '40 50% 97%',
            '--card-foreground': '0 0% 15%',
            '--popover': '40 50% 97%',
            '--popover-foreground': '0 0% 15%',
            '--primary': '0 0% 15%',
            '--primary-foreground': '40 50% 97%',
            '--secondary': '0 0% 25%',
            '--secondary-foreground': '40 50% 97%',
            '--muted': '0 0% 35%',
            '--muted-foreground': '0 0% 35%',
            '--accent': '0 0% 20%',
            '--accent-foreground': '40 50% 97%',
            '--destructive': '0 60% 50%',
            '--destructive-foreground': '40 50% 97%',
            '--border': '0 0% 88%',
            '--input': '0 0% 88%',
            '--ring': '0 0% 15%',
            '--radius': '0.25rem',
          } as React.CSSProperties}
        >
        <main className="bg-background">
            {/* Wedding Hero */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
                {/* Couple Names */}
                <div className="space-y-6">
                <h1 
                  className="great-vibes-regular font-script text-7xl md:text-8xl lg:text-9xl transition-colors duration-500"
                  style={{ color: data.templateColors.text }}
                >
                    {data.herName} та {data.hisName}
                </h1>
                <div 
                  className="h-px w-24 mx-auto transition-colors duration-500" 
                  style={{ backgroundColor: data.templateColors.text, opacity: 0.2 }}
                ></div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                <p 
                  className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase font-light transition-colors duration-500"
                  style={{ color: data.templateColors.text, opacity: 0.6 }}
                >
                    Просимо честі вашої присутності
                </p>
                <p 
                  className="font-sans text-base md:text-lg tracking-[0.2em] uppercase font-normal mt-6 transition-colors duration-500"
                  style={{ color: data.templateColors.text }}
                >
                    {data.weddingDate}
                </p>
                </div>

                {/* Venue Preview */}
                <div className="pt-8">
                <p 
                  className="font-sans text-xs md:text-sm tracking-[0.25em] uppercase font-light transition-colors duration-500"
                  style={{ color: data.templateColors.text, opacity: 0.6 }}
                >
                    {data.weddingPlace}
                </p>
                </div>
            </div>
            </section>

            {/* Wedding Countdown */}
            <section 
              className="relative py-16 px-6 overflow-hidden"
              style={{
                backgroundImage: `url(${countdownBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay for opacity control */}
              <div className="absolute inset-0 bg-background/60"></div>
              
              <div className="relative max-w-2xl mx-auto text-center space-y-8">
                {/* Script Headline */}
                <h2 
                  className="great-vibes-regular font-script text-5xl md:text-6xl transition-colors duration-500"
                  style={{ color: data.templateColors.text }}
                >
                  Пригода починається
                </h2>

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <div 
                      className="font-sans text-3xl md:text-4xl font-light tabular-nums transition-colors duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {timeLeft.days}
                    </div>
                    <div 
                      className="font-sans text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-500"
                      style={{ color: data.templateColors.text, opacity: 0.6 }}
                    >
                      Днів
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="font-sans text-3xl md:text-4xl font-light tabular-nums transition-colors duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {timeLeft.hours}
                    </div>
                    <div 
                      className="font-sans text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-500"
                      style={{ color: data.templateColors.text, opacity: 0.6 }}
                    >
                      Годин
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="font-sans text-3xl md:text-4xl font-light tabular-nums transition-colors duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {timeLeft.minutes}
                    </div>
                    <div 
                      className="font-sans text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-500"
                      style={{ color: data.templateColors.text, opacity: 0.6 }}
                    >
                      Хвилин
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="font-sans text-3xl md:text-4xl font-light tabular-nums transition-colors duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {timeLeft.seconds}
                    </div>
                    <div 
                      className="font-sans text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-500"
                      style={{ color: data.templateColors.text, opacity: 0.6 }}
                    >
                      Секунд
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Love Story */}
            {(data.loveStory.moment1 || data.loveStory.moment2) && (
              <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto space-y-12">
                  {/* Section Title */}
                  <h2 
                    className="great-vibes-regular font-script text-5xl md:text-6xl text-center transition-colors duration-500"
                    style={{ color: data.templateColors.text }}
                  >
                    Наша історія кохання
                  </h2>

                  {/* Story Moments */}
                  <div className="space-y-16 md:space-y-20">
                    {storyMoments.filter(moment => moment.text.trim()).map((moment, index) => (
                      <div
                        key={index}
                        className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                          moment.reverse ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Image */}
                        <div className={`${moment.reverse ? "md:order-2" : ""}`}>
                          <img
                            src={moment.image}
                            alt={`Момент історії кохання ${index + 1}`}
                            className="w-full h-auto aspect-[3/4] object-cover"
                          />
                        </div>

                        {/* Text */}
                        <div className={`flex items-center ${moment.reverse ? "md:order-1" : ""}`}>
                          <p 
                            className="font-sans text-xs tracking-[0.2em] uppercase font-light leading-relaxed text-justify transition-colors duration-500"
                            style={{ color: data.templateColors.text, opacity: 0.6 }}
                          >
                            {moment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Wedding Colours */}
            {data.weddingColors.length > 0 && (
              <section className="py-16 px-6">
                <div className="max-w-2xl mx-auto text-center space-y-10">
                  {/* Section Title */}
                  <h2 
                    className="great-vibes-regular font-script text-5xl md:text-6xl transition-colors duration-500"
                    style={{ color: data.templateColors.text }}
                  >
                    Кольори весілля
                  </h2>

                  {/* Colour Swatches */}
                  <div className="flex justify-center items-center gap-6 md:gap-8">
                    {colours.map((colour, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-500"
                        style={{ backgroundColor: colour.hex }}
                        aria-label={colour.name}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Order of Events */}
            {data.events.length > 0 && (
              <section className="py-14 px-6">
                <div className="max-w-xl mx-auto">
                  {/* Section Title */}
                  <h2 
                    className="great-vibes-regular font-script text-5xl md:text-6xl text-center mb-16 transition-colors duration-500"
                    style={{ color: data.templateColors.text }}
                  >
                    Програма подій
                  </h2>

                  {/* Timeline */}
                  <div className="space-y-8">
                    {data.events.map((event, index) => (
                      <div
                        key={event.id}
                        className="flex items-baseline justify-between pb-6 animate-in fade-in duration-700 transition-all duration-500"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          borderBottom: `1px solid ${data.templateColors.text}20`,
                        }}
                      >
                        {/* Time - slightly heavier weight */}
                        <span 
                          className="font-sans text-sm md:text-base tracking-[0.2em] uppercase font-medium transition-colors duration-500"
                          style={{ color: data.templateColors.text }}
                        >
                          {event.time}
                        </span>
                        
                        {/* Event Title - lighter weight */}
                        <span 
                          className="font-sans text-sm md:text-base tracking-[0.25em] uppercase font-light transition-colors duration-500"
                          style={{ color: data.templateColors.text }}
                        >
                          {event.eventName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Venue Details */}
            <section className="py-14 px-6">
              <div className="max-w-xl mx-auto text-center space-y-12">
                {/* Section Title */}
                <h2 
                  className="great-vibes-regular font-script text-5xl md:text-6xl transition-colors duration-500"
                  style={{ color: data.templateColors.text }}
                >
                  Місце проведення
                </h2>

                {/* Venue Info */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p 
                      className="font-sans text-sm md:text-base tracking-[0.2em] uppercase font-normal transition-colors duration-500"
                      style={{ color: data.templateColors.text }}
                    >
                      {data.weddingPlace}
                    </p>
                  </div>

                  {/* Divider */}
                  <div 
                    className="h-px w-16 mx-auto transition-colors duration-500" 
                    style={{ backgroundColor: data.templateColors.text, opacity: 0.2 }}
                  ></div>

                  {/* Closing Message */}
                  <p 
                    className="font-sans text-sm md:text-base tracking-[0.2em] uppercase font-light transition-colors duration-500"
                    style={{ color: data.templateColors.text, opacity: 0.7 }}
                  >
                    Чекаємо на вас!
                  </p>
                </div>
              </div>
            </section>
        </main>
        </div>
        </>
    )
}