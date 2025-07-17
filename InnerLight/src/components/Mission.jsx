import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const slideInRight = {
    hidden: { x: 150, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section ref={ref} className="container py-5">
      <div className="row align-items-center">
        {/* Static Image */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src="/hands.avif"
            alt="Helping Hands"
            className="img-fluid"
            style={{ maxHeight: "320px" }}
          />
        </div>

        {/* Sliding Text */}
        <div className="col-md-6">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideInRight}
          >
            <h2 className="fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Mission
            </h2>
            <p className="text-muted lead">
              At InnerLight, our mission is to hold space for healing, growth, and gentle transformation.
              We guide you to reconnect with your inner peace — one mindful step at a time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Mission;
