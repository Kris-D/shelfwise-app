import { useState, useEffect } from 'react';
import { encryptRequest, decryptResponse } from './crypto';
import { api } from './agent';

const EncryptionDebugger = () => {
  const [testData, setTestData] = useState('{"message": "Hello, World!", "value": 42}');
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [environment, setEnvironment] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Load environment variables for debugging
    setEnvironment({
      PassPhrase: import.meta.env.VITE_PassPhrase,
      SaltValue: import.meta.env.VITE_SaltValue,
      InitVector: import.meta.env.VITE_InitialVector,
      PasswordIterations: import.meta.env.VITE_PasswordIterations,
      Blocksize: import.meta.env.VITE_BlockSize,
    });
  }, []);

  const handleEncrypt = () => {
    try {
      setError('');
      const parsedData = JSON.parse(testData);
      const encrypted = encryptRequest(parsedData);
      setEncryptedData(encrypted);
      
      // Try to decrypt immediately to verify the cycle works
      const decrypted = decryptResponse(encrypted);
      setDecryptedData(typeof decrypted === 'string' ? decrypted : JSON.stringify(decrypted, null, 2));
    } catch (err) {
      setError(`Encryption error: ${err.message}`);
    }
  };

  const testServerCommunication = async () => {
    try {
      setError('');
      const parsedData = JSON.parse(testData);
      
      // Make a test request to the server
      const response = await api.post('/api/test-encryption', parsedData);
      setServerResponse(typeof response === 'string' ? response : JSON.stringify(response, null, 2));
    } catch (err) {
      setError(`Server test error: ${err.message}`);
      if (err.response) {
        console.error('Server response error:', err.response);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Encryption Debugger</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Environment Variables</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(environment, null, 2)}
        </pre>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeeee' }}>
          Error: {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Test Data (JSON):
          <textarea
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            style={{ width: '100%', minHeight: '80px', fontFamily: 'monospace' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleEncrypt} style={{ marginRight: '10px' }}>
          Test Encryption/Decryption
        </button>
        <button onClick={testServerCommunication}>
          Test Server Communication
        </button>
      </div>
      
      {encryptedData && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Encrypted Data:</h4>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#e8f4f8', 
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            {encryptedData}
          </div>
        </div>
      )}
      
      {decryptedData && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Decrypted Data:</h4>
          <pre style={{ 
            padding: '10px', 
            backgroundColor: '#e8f8e8', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
            {decryptedData}
          </pre>
        </div>
      )}
      
      {serverResponse && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Server Response:</h4>
          <pre style={{ 
            padding: '10px', 
            backgroundColor: '#f8f8e8', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
            {serverResponse}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fff8dc', borderRadius: '5px' }}>
        <h3>Common Issues to Check:</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>Ensure environment variables are correctly loaded (check above)</li>
          <li>Verify IV is exactly 16 bytes after Base64 decoding</li>
          <li>Check that frontend and backend use the same encryption parameters</li>
          <li>Ensure server encryption middleware is properly ordered (before body parsing)</li>
          <li>Confirm headers are being set correctly (x-encrypted-request, x-encrypt-response)</li>
        </ul>
      </div>
    </div>
  );
};

export default EncryptionDebugger;