import React from "react";
import { Stethoscope, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    title: "Consulter un professionnel",
    desc: "Prenez rendez-vous avec un psychologue ou un psychiatre qualifié en toute confidentialité.",
    icon: <Stethoscope size={28} />,
  },
  {
    title: "Accéder à des ressources",
    desc: "Articles, exercices et conseils validés pour votre bien-être mental.",
    icon: <BookOpen size={28} />,
  },
  {
    title: "Communauté bienveillante",
    desc: "Exprimez-vous librement dans un espace anonyme et sécurisé.",
    icon: <Users size={28} />,
  },
];

// 🍏 SECTION TITLE ANIMATION (Apple style reveal)
const titleVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// 🍏 CONTAINER STAGGER (Apple-like flow)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

// 🍏 CARD ANIMATION (smooth + depth)
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FonctionnalitesApple = () => {
  return (
    <section
      style={{
        padding: "120px 20px",
        background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
      }}
    >
      {/* 🍏 TITLE */}
      <motion.div
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: 80,
        }}
      >
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-1px",
            color: "#111827",
          }}
        >
          Une plateforme pensée pour votre bien-être
        </h2>

        <p
          style={{
            marginTop: 16,
            fontSize: 18,
            color: "#6b7280",
            maxWidth: 600,
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Une expérience fluide, simple et sécurisée — inspirée des meilleures
          interfaces modernes.
        </p>
      </motion.div>

      {/* 🍏 GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 30,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{
              y: -10,
              scale: 1.03,
              boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
            }}
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: 24,
              padding: 28,
              cursor: "pointer",
            }}
          >
            {/* ICON */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginBottom: 20,
              }}
            >
              {item.icon}
            </div>

            {/* TEXT */}
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 10,
                color: "#111827",
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FonctionnalitesApple;