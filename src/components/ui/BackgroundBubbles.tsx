export default function BackgroundBubbles() {
  // We can create a list of bubbles to render
  const bubbleCount = 20;
  const bubbles = Array.from({ length: bubbleCount }, (_, i) => i);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {bubbles.map((index) => (
        <div
          key={index}
          className="bubble bg-primary/10 rounded-full absolute"
          // We use inline styles to give each bubble a unique size, position, and animation delay
          style={{
            width: `${Math.random() * 15 + 50}px`,
            height: `${Math.random() * 15 + 50}px`,
            left: `${Math.random() * 100}%`,
            bottom: "-150px", // Start below the screen
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 15}s`, // Random duration between 15s and 35s
          }}
        />
      ))}
    </div>
  );
}
