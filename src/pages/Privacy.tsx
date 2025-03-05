
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Privacy = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? (
        <MobileHeader />
      ) : (
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link to="/" className="text-brand-600 flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('common.back')}</span>
            </Link>
          </div>
        </header>
      )}

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.introduction.title')}</h2>
            <p className="text-gray-700">{t('privacy.introduction.content')}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.dataCollection.title')}</h2>
            <p className="text-gray-700">{t('privacy.dataCollection.content')}</p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>{t('privacy.dataCollection.item1')}</li>
              <li>{t('privacy.dataCollection.item2')}</li>
              <li>{t('privacy.dataCollection.item3')}</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.dataUsage.title')}</h2>
            <p className="text-gray-700">{t('privacy.dataUsage.content')}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.cookies.title')}</h2>
            <p className="text-gray-700">{t('privacy.cookies.content')}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.thirdParty.title')}</h2>
            <p className="text-gray-700">{t('privacy.thirdParty.content')}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.rights.title')}</h2>
            <p className="text-gray-700">{t('privacy.rights.content')}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.contact.title')}</h2>
            <p className="text-gray-700">{t('privacy.contact.content')}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('privacy.updates.title')}</h2>
            <p className="text-gray-700">{t('privacy.updates.content')}</p>
          </section>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>{t('privacy.lastUpdated')}: 2023-10-01</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
