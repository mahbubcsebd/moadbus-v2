import { getDocuments } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { globals } from '@/globals/appGlobals';
import { downloadDocument, isMobileApp, transformDocumentResponse } from '@/utils/documents';
import { useTranslation } from '@/utils/t';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const t = useTranslation();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDocuments();
      console.log('Raw API Response:', response);

      const result = transformDocumentResponse(response);
      console.log('Transformed Result:', result);

      if (result.success && result.documents.length > 0) {
        setDocuments(result.documents);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Fetch documents error:', err);
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      setDownloading(doc.id);
      await downloadDocument(doc, globals.bankId);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document');
    } finally {
      setDownloading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <HeaderTop
          title="Documents & Forms"
          text="Access and download important bank documents and policies"
          link="/dashboard"
          linkText="Back to Dashboard"
        />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 mb-4 text-primary animate-spin" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <HeaderTop
          title="Documents & Forms"
          text="Access and download important bank documents and policies"
          link="/dashboard"
          linkText="Back to Dashboard"
        />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex items-center justify-center w-20 h-20 mb-4 bg-red-100 rounded-full">
            <FileText className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Error Loading Documents</h3>
          <p className="mb-4 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchDocuments}
            className="px-6 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <div>
        <HeaderTop
          title="Documents & Forms"
          text="Access and download important bank documents and policies"
          link="/dashboard"
          linkText="Back to Dashboard"
        />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No Documents Available</h3>
          <p className="text-sm text-gray-500">There are no documents to display at this time.</p>
        </div>
      </div>
    );
  }

  const isNativeApp = isMobileApp();

  return (
    <div>
      {/* Header */}
      <HeaderTop
        title={t('main.formsDocuments')}
        text="Access and download important bank documents and policies"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      {/* Documents Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
      >
        {documents.map((doc, index) => {
          const isDownloading = downloading === doc.id;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md group"
            >
              <div className="p-5 border-b border-gray-100 md:p-6 bg-linear-to-br from-primary/5 to-orange/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                      {doc.displayName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                  </div>
                  <div className="p-3 transition-colors rounded-lg bg-primary/10 shrink-0 group-hover:bg-primary/20">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <button
                  onClick={() => handleDownload(doc)}
                  disabled={isDownloading}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition-all rounded-lg shadow-sm bg-primary hover:bg-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>{isNativeApp ? 'Download' : 'View Document'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Total count */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Total {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </p>
      </motion.div>
    </div>
  );
};

export default Documents;
