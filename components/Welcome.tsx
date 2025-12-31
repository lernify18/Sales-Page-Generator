
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="text-center p-8 bg-gray-800/50 border border-gray-700 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-100">Selamat Datang!</h2>
      <p className="mt-2 text-gray-400">
        Masukkan nama produk anda di atas dan klik "Jana Skrip Power" untuk dapatkan skrip jualan WhatsApp yang lengkap, santai & terbukti berkesan untuk pasaran Malaysia.
      </p>
      <div className="mt-6 text-left max-w-md mx-auto space-y-2 text-gray-300">
        <p>✅ Skrip Intro & Follow-up</p>
        <p>✅ Offer & Upsell Package</p>
        <p>✅ Testimoni & Bukti Postage</p>
      </div>
    </div>
  );
};

export default Welcome;
