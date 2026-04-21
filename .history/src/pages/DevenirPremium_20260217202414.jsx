import React, { useState } from "react";
import Layout from "../components/commun/Layout";
import PremiumPaymentModal from "../components/commun/premium/PremiumPaymentModal";
 

const DevenirPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [openModal, setOpenModal] = useState(false);

  /* Plans */
  const plans = {
    monthly: {
      label: "Mensuel",
      price: 3,
      duration: "mois",
    },
    quarterly: {
      label: "Trimestriel",
      price: 10,
      duration: "3 mois",
    },
    annually: {
      label: "Annuel",
      price: 30,
      duration: "an",
    },
  };

  const currentPlan = plans[selectedPlan];

  return (
    <Layout>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 px-6 py-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-indigo-800 mb-4">
          Devenez Premium 🌟
        </h1>

        <p className="text-gray-600 text-center max-w-xl mb-8">
          Accédez aux ressources exclusives, exercices avancés, vidéos guidées et
          fonctionnalités Premium.
        </p>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
          {/* Plans buttons */}
          <div className="flex justify-center gap-3 mb-6">
            {Object.keys(plans).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  selectedPlan === key
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {plans[key].label}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <p className="text-5xl font-extrabold text-gray-900">
              {currentPlan.price}€
            </p>
            <p className="text-gray-500 text-sm">
              / {currentPlan.duration}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={() => setOpenModal(true)}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
          >
            Payer et devenir Premium 🚀
          </button>
        </div>

        {/* Modal Stripe */}
        {openModal && (
          <PremiumPaymentModal
            planId={selectedPlan}
            onClose={() => setOpenModal(false)}
          />
        )}
      </main>
    </Layout>
  );
};

export default DevenirPremium;