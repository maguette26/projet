import React, { useState } from "react";
import PremiumPaymentModal from "../components/premium/PremiumPaymentModal";

const DevenirPremium = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  return (
    <div className="flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">
        Devenir Premium ⭐
      </h1>

      {/* Plan select */}
      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="monthly">Mensuel - 3€</option>
        <option value="quarterly">Trimestriel - 10€</option>
        <option value="annually">Annuel - 30€</option>
      </select>

      {/* Button open modal */}
      <button
        onClick={() => setOpenModal(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
      >
        Devenir Premium
      </button>

      {/* Modal */}
      {openModal && (
        <PremiumPaymentModal
          planId={selectedPlan}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default DevenirPremium;