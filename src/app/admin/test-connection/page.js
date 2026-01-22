'use client';

import { useState } from 'react';
import { appwriteConfig } from '@/lib/appwrite/config';

export default function TestConnectionPage() {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    const testResults = {};

    // Test 1: Environment Variables
    testResults.envVars = {
      endpoint: appwriteConfig.endpoint || '❌ Missing',
      projectId: appwriteConfig.projectId || '❌ Missing',
      databaseId: appwriteConfig.databaseId || '❌ Missing',
      membersCollectionId: appwriteConfig.membersCollectionId || '❌ Missing',
      paymentsCollectionId: appwriteConfig.paymentsCollectionId || '❌ Missing',
      plansCollectionId: appwriteConfig.plansCollectionId || '❌ Missing',
    };

    // Test 2: Appwrite Endpoint Reachability
    try {
      const response = await fetch(`${appwriteConfig.endpoint}/health`, {
        method: 'GET',
      });
      testResults.endpointReachable = response.ok ? '✅ Reachable' : '❌ Not reachable';
    } catch (error) {
      testResults.endpointReachable = `❌ Error: ${error.message}`;
    }

    // Test 3: Project Connection
    try {
      const response = await fetch(`${appwriteConfig.endpoint}/account`, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': appwriteConfig.projectId,
          'Content-Type': 'application/json',
        },
      });
      testResults.projectConnection = response.status === 401 
        ? '✅ Project exists (401 = not authenticated, which is expected)'
        : `Status: ${response.status}`;
    } catch (error) {
      testResults.projectConnection = `❌ Error: ${error.message}`;
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h1 className="text-3xl font-bold text-white mb-4">🔧 Appwrite Connection Test</h1>
        <p className="text-neutral-400 mb-6">
          Use this page to verify your Appwrite configuration on Vercel
        </p>

        <button
          onClick={testConnection}
          disabled={testing}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 mb-6"
        >
          {testing ? 'Testing...' : 'Run Connection Test'}
        </button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-3">📋 Environment Variables</h2>
              <div className="space-y-2 font-mono text-sm">
                {Object.entries(results.envVars || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-400">{key}:</span>
                    <span className={value.includes('❌') ? 'text-red-500' : 'text-green-500'}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
              <h2 className="text-xl font-bold text-white mb-3">🌐 Connection Tests</h2>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Endpoint Reachable:</span>
                  <span className={results.endpointReachable?.includes('❌') ? 'text-red-500' : 'text-green-500'}>
                    {results.endpointReachable}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Project Connection:</span>
                  <span className={results.projectConnection?.includes('❌') ? 'text-red-500' : 'text-green-500'}>
                    {results.projectConnection}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">💡 Next Steps:</h3>
              <ul className="text-sm text-neutral-300 space-y-1 list-disc list-inside">
                <li>If environment variables are missing: Add them in Vercel Settings</li>
                <li>If endpoint not reachable: Check your NEXT_PUBLIC_APPWRITE_ENDPOINT</li>
                <li>If project connection fails: Verify NEXT_PUBLIC_APPWRITE_PROJECT_ID</li>
                <li>If all tests pass: Try logging in again at /admin/ironcore/login</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <h3 className="text-yellow-500 font-semibold mb-2">⚠️ Important:</h3>
          <p className="text-sm text-neutral-300">
            After adding/updating environment variables in Vercel, you MUST redeploy for changes to take effect.
          </p>
        </div>
      </div>
    </div>
  );
}
