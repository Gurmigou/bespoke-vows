import { useState, useEffect } from "react";
import { InvitationData } from "@/pages/Builder";
import countdownBg from "@/img/countdown-bg.jpg";
import storyPhoto1 from "@/img/story-photo-1.jpg";
import storyPhoto2 from "@/img/story-photo-2.jpg";

interface InvitationPreviewProps {
    data: InvitationData;
  }

export const InvitationPreview = ({ data }: InvitationPreviewProps) => {
    // Wedding Countdown Logic
    const weddingDate = new Date("2025-06-15T16:00:00");
    
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
    }, []);

    // Love Story Data
    const storyMoments = [
      {
        image: storyPhoto1,
        text: "Ми зустрілися дощовим післяобіднім часом у жовтні 2019 року в маленькій кав'ярні у Вест-Вілліджі. Те, що почалося як випадкова зустріч біля спільного столика, перетворилося на години розмов про мистецтво, подорожі та мрії, які ми ще не знали, що будуємо разом.",
        reverse: false,
      },
      {
        image: storyPhoto2,
        text: "Три роки потому, на тій самій вулиці, де ми вперше зустрілися, Джеймс став на одне коліно. Дощ повернувся, як і того першого дня, але цього разу здавалося, що всесвіт змовляється, щоб завершити нашу історію повним колом.",
        reverse: true,
      },
    ];

    // Wedding Colours Data
    const colours = [
      { name: "Теплий беж", hex: "#D4C4B0" },
      { name: "М'який голубий сірий", hex: "#C9C5C1" },
      { name: "Приглушений тауп", hex: "#B8ADA0" },
      { name: "Медовий беж", hex: "#E5D5C3" },
      { name: "Приглушений шалфей", hex: "#B8BCAA" },
    ];

    // Order of Events Data
    const events = [
      { time: "16:00", title: "Церемонія" },
      { time: "17:00", title: "Коктейльна година" },
      { time: "18:30", title: "Прийом" },
      { time: "19:00", title: "Вечеря" },
      { time: "21:00", title: "Танці" },
    ];

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
                <h1 className="great-vibes-regular font-script text-7xl md:text-8xl lg:text-9xl text-foreground">
                    Сара та Джеймс
                </h1>
                <div className="h-px w-24 mx-auto bg-foreground opacity-20"></div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase font-light text-muted">
                    Просимо честі вашої присутності
                </p>
                <p className="font-sans text-base md:text-lg tracking-[0.2em] uppercase font-normal text-foreground mt-6">
                    15 червня 2025
                </p>
                </div>

                {/* Venue Preview */}
                <div className="pt-8">
                <p className="font-sans text-xs md:text-sm tracking-[0.25em] uppercase font-light text-muted">
                    Маєток Роузвуд
                </p>
                <p className="font-sans text-xs tracking-[0.2em] uppercase font-light text-muted mt-2">
                    Санта-Барбара, Каліфорнія
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
                <h2 className="great-vibes-regular font-script text-5xl md:text-6xl text-foreground">
                  Пригода починається
                </h2>

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <div className="font-sans text-3xl md:text-4xl font-light text-foreground tabular-nums">
                      {timeLeft.days}
                    </div>
                    <div className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-muted">
                      Днів
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-sans text-3xl md:text-4xl font-light text-foreground tabular-nums">
                      {timeLeft.hours}
                    </div>
                    <div className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-muted">
                      Годин
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-sans text-3xl md:text-4xl font-light text-foreground tabular-nums">
                      {timeLeft.minutes}
                    </div>
                    <div className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-muted">
                      Хвилин
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-sans text-3xl md:text-4xl font-light text-foreground tabular-nums">
                      {timeLeft.seconds}
                    </div>
                    <div className="font-sans text-xs tracking-[0.25em] uppercase font-medium text-muted">
                      Секунд
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Love Story */}
            <section className="py-16 px-6">
              <div className="max-w-5xl mx-auto space-y-12">
                {/* Section Title */}
                <h2 className="great-vibes-regular font-script text-5xl md:text-6xl text-center text-foreground">
                  Наша історія кохання
                </h2>

                {/* Story Moments */}
                <div className="space-y-16 md:space-y-20">
                  {storyMoments.map((moment, index) => (
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
                        <p className="font-sans text-xs tracking-[0.2em] uppercase font-light text-muted leading-relaxed text-justify">
                          {moment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Wedding Colours */}
            <section className="py-16 px-6">
              <div className="max-w-2xl mx-auto text-center space-y-10">
                {/* Section Title */}
                <h2 className="great-vibes-regular font-script text-5xl md:text-6xl text-foreground">
                  Весняні нейтральні
                </h2>

                {/* Colour Swatches */}
                <div className="flex justify-center items-center gap-6 md:gap-8">
                  {colours.map((colour, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                      style={{ backgroundColor: colour.hex }}
                      aria-label={colour.name}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Order of Events */}
            <section className="py-14 px-6">
              <div className="max-w-xl mx-auto">
                {/* Section Title */}
                <h2 className="great-vibes-regular font-script text-5xl md:text-6xl text-center text-foreground mb-16">
                  Програма подій
                </h2>

                {/* Timeline */}
                <div className="space-y-8">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-baseline justify-between border-b border-border pb-6 animate-in fade-in duration-700"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Time - slightly heavier weight */}
                      <span className="font-sans text-sm md:text-base tracking-[0.2em] uppercase font-medium text-foreground">
                        {event.time}
                      </span>
                      
                      {/* Event Title - lighter weight */}
                      <span className="font-sans text-sm md:text-base tracking-[0.25em] uppercase font-light text-foreground">
                        {event.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Venue Details */}
            <section className="py-14 px-6">
              <div className="max-w-xl mx-auto text-center space-y-12">
                {/* Section Title */}
                <h2 className="great-vibes-regular font-script text-5xl md:text-6xl text-foreground">
                  Місце проведення
                </h2>

                {/* Venue Info */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="font-sans text-sm md:text-base tracking-[0.2em] uppercase font-normal text-foreground">
                      Маєток Роузвуд
                    </p>
                    <p className="font-sans text-xs tracking-[0.25em] uppercase font-light text-muted">
                      Вулиця Виноградників, 1234
                    </p>
                    <p className="font-sans text-xs tracking-[0.25em] uppercase font-light text-muted">
                      Санта-Барбара, Каліфорнія 93108
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-16 mx-auto bg-foreground opacity-20"></div>

                  {/* Additional Info */}
                  <div className="space-y-4 pt-4">
                    <p className="font-sans text-xs tracking-[0.2em] uppercase font-light text-muted leading-relaxed max-w-md mx-auto">
                      Церемонія в саду на Південному газоні, після чого прийом у Великій консерваторії
                    </p>
                  </div>
                </div>
              </div>
            </section>
        </main>
        </div>
        </>
    )
}