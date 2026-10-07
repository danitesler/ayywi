import { Card, CardDescription, CardHeader, CardTitle, Carousel, CarouselSlide } from "@danitesler/ayywi/react";

const features = [
  { title: "Identity", text: "One four-point star wherever a feature is powered by AI." },
  { title: "Assist", text: "Rephrase, change tone or shorten, one task at a time." },
  { title: "Processing", text: "A calm loading state while a response is written." },
  { title: "Feedback", text: "Thumbs up or down on every answer, right where it appears." },
  { title: "Errors", text: "Plain words and a retry when something fails." },
];

export default function Example() {
  return (
    <Carousel label="AI assistant features" slideWidth="15rem" style={{ inlineSize: "100%" }}>
      {features.map((f) => (
        <CarouselSlide key={f.title}>
          <Card>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.text}</CardDescription>
            </CardHeader>
          </Card>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
