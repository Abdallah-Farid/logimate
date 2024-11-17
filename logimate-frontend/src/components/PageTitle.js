import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const PageTitle = ({ title, subtitle = '' }) => {
  const { t } = useTranslation();
  const translatedTitle = t(title);
  const translatedSubtitle = subtitle ? t(subtitle) : '';

  return (
    <>
      <Helmet>
        <title>{translatedTitle} - Logimate</title>
      </Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          {translatedTitle}
        </h1>
        {translatedSubtitle && (
          <p className="mt-2 text-sm text-gray-600">{translatedSubtitle}</p>
        )}
      </div>
    </>
  );
};

export default PageTitle;
