export async function triggerConfetti() {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C8442B', '#D97706', '#2563EB', '#16A34A', '#FAF7F2']
    });
  } catch (err) {
    console.log('Confetti triggered (module not loaded):', err);
  }
}
