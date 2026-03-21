// Encryption Utilities for Luminary Wishes
// Provides Base64 encoding/decoding for URL parameters to obfuscate personal information

/**
 * Encrypts (Base64 encodes) an object into a URL-safe string
 * @param {Object} data - The data object to encrypt
 * @returns {string} Base64 encoded string
 */
function encryptData(data) {
    try {
        // Convert object to JSON string
        const jsonString = JSON.stringify(data);

        // Encode to Base64
        const base64 = btoa(unescape(encodeURIComponent(jsonString)));

        // Make URL-safe by replacing characters
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
}

/**
 * Decrypts (Base64 decodes) a URL-safe string back into an object
 * @param {string} encrypted - The Base64 encoded string
 * @returns {Object|null} Decrypted data object or null if decryption fails
 */
function decryptData(encrypted) {
    try {
        if (!encrypted) {
            return null;
        }

        // Restore Base64 format from URL-safe format
        let base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        // Decode from Base64
        const jsonString = decodeURIComponent(escape(atob(base64)));

        // Parse JSON back to object
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

/**
 * Checks if a URL parameter is encrypted
 * @param {URLSearchParams} params - URL search parameters
 * @returns {boolean} True if encrypted parameter exists
 */
function hasEncryptedParam(params) {
    return params.has('data');
}

/**
 * Gets decrypted data from URL parameters
 * Falls back to reading individual parameters if no encrypted data found
 * @param {URLSearchParams} params - URL search parameters
 * @returns {Object} Decrypted data or individual parameters
 */
function getDataFromURL(params) {
    // Check for encrypted parameter first
    if (hasEncryptedParam(params)) {
        const encryptedData = params.get('data');
        const decrypted = decryptData(encryptedData);
        if (decrypted) {
            return decrypted;
        }
    }

    // Fallback to individual parameters for backward compatibility
    return {
        name: params.get('name') || null,
        name1: params.get('name1') || null,
        name2: params.get('name2') || null,
        age: params.get('age') || null,
        years: params.get('years') || null,
        date: params.get('date') || null,
        message: params.get('message') || null
    };
}

// Log successful load
console.log('%c🔒 Encryption Utils Loaded', 'color: #43e97b; font-weight: bold;');
