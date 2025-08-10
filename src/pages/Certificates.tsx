import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  useGetMyCertificatesQuery, 
  useLazyDownloadCertificateQuery 
} from '../store/api/certificateApi';
import { toast } from 'react-toastify';
import { 
  FiDownload, 
  FiAward, 
  FiCalendar, 
  FiHash, 
  FiCheckCircle 
} from 'react-icons/fi';
import { format } from 'date-fns';

const Certificates: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { 
    data: certificatesData, 
    isLoading, 
    refetch 
  } = useGetMyCertificatesQuery();
  
  const [downloadCertificate] = useLazyDownloadCertificateQuery();

  const certificates = certificatesData?.data?.certificates || [];

  const handleDownload = async (certificateId: string, certificateNumber: string) => {
    try {
      const result = await downloadCertificate(certificateId);
      
      if (result.data) {
        const blob = result.data as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificate-${certificateNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Certificate downloaded successfully!');
      }
    } catch (error: any) {
      toast.error('Failed to download certificate');
    }
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-yellow-100 text-yellow-800',
      'A2': 'bg-yellow-200 text-yellow-900',
      'B1': 'bg-blue-100 text-blue-800',
      'B2': 'bg-blue-200 text-blue-900',
      'C1': 'bg-green-100 text-green-800',
      'C2': 'bg-green-200 text-green-900'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Certificates</h1>
        <p className="text-lg text-gray-600">
          View and download your digital competency certificates
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="card text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiAward className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Certificates Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Complete your assessment to earn your first certificate
          </p>
          <button
            onClick={() => window.location.href = '/assessment'}
            className="btn-primary"
          >
            Start Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {certificates.map((certificate: any) => (
            <div 
              key={certificate._id} 
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <FiAward className="text-primary-600" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Digital Competency Certificate
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(certificate.level)}`}>
                        Level {certificate.level}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FiHash size={16} />
                        <span className="text-sm">Certificate #{certificate.certificateNumber}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FiCalendar size={16} />
                        <span className="text-sm">
                          Issued on {format(new Date(certificate.issuedDate), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FiCheckCircle size={16} />
                        <span className="text-sm">
                          Valid until {certificate.validUntil 
                            ? format(new Date(certificate.validUntil), 'MMMM dd, yyyy')
                            : 'Permanent'
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-sm">
                          Verification: {certificate.verificationCode}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      This certificate verifies that <strong>{user?.firstName} {user?.lastName}</strong> has 
                      successfully demonstrated competency at the {certificate.level} level in digital skills assessment.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDownload(certificate._id, certificate.certificateNumber)}
                  className="flex items-center space-x-2 btn-primary ml-4"
                >
                  <FiDownload size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Verification Info */}
      <div className="card mt-8 bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <FiCheckCircle className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Certificate Verification</h3>
            <p className="text-sm text-blue-800 mb-2">
              All certificates can be verified using the certificate number and verification code.
            </p>
            <p className="text-sm text-blue-700">
              To verify a certificate, visit our verification portal or contact our support team 
              with the certificate number and verification code.
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Summary */}
      {certificates.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => {
              const hasLevel = certificates.some((cert: any) => cert.level === level);
              return (
                <div 
                  key={level}
                  className={`text-center p-3 rounded-lg border-2 ${
                    hasLevel 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`text-lg font-bold ${
                    hasLevel ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {level}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {hasLevel ? 'Achieved' : 'Not achieved'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Highest Level Achieved: <strong className="text-primary-600">
                {certificates.length > 0 
                  ? certificates.sort((a: any, b: any) => 
                      ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(b.level) - 
                      ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(a.level)
                    )[0].level
                  : 'None'
                }
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;