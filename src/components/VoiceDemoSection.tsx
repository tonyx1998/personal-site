import VoiceDemo from "./VoiceDemo";

// Server Component gate: the realtime voice demo only renders when an
// OPENAI_API_KEY is configured. Without it, this returns null so the section is
// entirely absent from the public site — no broken UI, no API calls, no cost.
export default function VoiceDemoSection() {
  if (!process.env.OPENAI_API_KEY) return null;

  return (
    <section id="ai-demo" className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-accent font-mono text-sm mb-2">live · ai</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            See it, don&apos;t just read it
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A working slice of my realtime-voice work, running right here in
            your browser.
          </p>
        </div>
        <VoiceDemo />
      </div>
    </section>
  );
}
