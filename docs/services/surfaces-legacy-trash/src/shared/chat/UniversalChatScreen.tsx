import React from 'react';

export interface UniversalChatScreenProps {
  config: {
    service: string;
    operationId?: string;
    entityType: string;
    entityId: string;
    features?: {
      fileUpload?: boolean;
      voiceMessages?: boolean;
      locationSharing?: boolean;
      readReceipts?: boolean;
      typingIndicators?: boolean;
    };
    styling: {
      primaryColor: string;
      title: string;
    };
    api: {
      baseUrl: string;
      endpoints: Record<string, string>;
    };
  };
}

export const UniversalChatScreen: React.FC<UniversalChatScreenProps> = ({ config }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {config.styling.title}
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Universal Chat Screen
            </h3>
            <div className="text-sm text-blue-700">
              <p><strong>Service:</strong> {config.service}</p>
              <p><strong>Operation:</strong> {config.operationId || 'N/A'}</p>
              <p><strong>Entity:</strong> {config.entityType}</p>
              <p><strong>Status:</strong> <span className="text-green-600">Ready for implementation</span></p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              This is a placeholder implementation. The actual chat functionality will be implemented based on the operation requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
