@keyframes blob {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(20px, -10px) scale(1.05);
  }
  66% {
    transform: translate(-15px, 15px) scale(0.95);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
