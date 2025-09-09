// src/utils/constraintParser.js

/**
 * Transform API response of constraints into
 * title + dropdown options
 * 
 * @param {Array} data - API response array
 * @returns {Array} transformed array
 */
export const transformConstraints = (data = []) => {
  return data.map(item => {
    // 🔹 Regex to extract all values inside single quotes
    const matches = item.constraintDefinition.match(/'([^']+)'/g) || [];
    const options = matches.map(m => m.replace(/'/g, "")); // clean quotes

    return {
      title: item.constraintName,
      options
    };
  });
};


// src/utils/fileUtils.js

// ✅ Convert file to Base64 (returns only the string part after comma)
export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};


// ✅ Toggle product selection (keeps unique values)
export const toggleAllowed = (prevForm, productName) => {
  const exists = prevForm.allowedProducts.includes(productName);
  const updated = exists
    ? prevForm.allowedProducts.filter((p) => p !== productName)
    : [...new Set([...prevForm.allowedProducts, productName])];

  return { ...prevForm, allowedProducts: updated };
};

// ✅ Build metadata (reused in multiple payloads)
export const buildMetadata = (user = "system-admin") => {
  const now = new Date().toISOString();
  return {
    createdBy: user,
    createdDate: now,
    modifiedBy: user,
    modifiedDate: now,
    header: {
      additionalProp1: {
        options: { propertyNameCaseInsensitive: true },
        parent: "root",
        root: "metadata"
      },
      additionalProp2: {
        options: { propertyNameCaseInsensitive: true },
        parent: "root",
        root: "metadata"
      },
      additionalProp3: {
        options: { propertyNameCaseInsensitive: true },
        parent: "root",
        root: "metadata"
      }
    }
  };
};


// ✅ Build requestInfo (standard everywhere)
export const buildRequestInfo = (ip, user = "system-admin") => {
  const now = new Date().toISOString();
  return {
    ipAddress: ip || "0.0.0.0",
    userAgent: navigator.userAgent,
    headers: "rfrfrf",
    channel: "WEB_PORTAL",
    auditMetadata: {
      createdBy: user,
      createdDate: now,
      modifiedBy: user,
      modifiedDate: now,
      header: {
        additionalProp1: {
          options: { propertyNameCaseInsensitive: true },
          parent: "root",
          root: "auditMetadata"
        },
        additionalProp2: {
          options: { propertyNameCaseInsensitive: true },
          parent: "root",
          root: "auditMetadata"
        },
        additionalProp3: {
          options: { propertyNameCaseInsensitive: true },
          parent: "root",
          root: "auditMetadata"
        }
      }
    }
  };
};


// utils/documents.js

export const prepareDocuments = async ({ agreementFile, idFile, addressFile }) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // strip prefix
      reader.onerror = (error) => reject(error);
    });

  return {
    agreementDoc: agreementFile ? await toBase64(agreementFile) : null,
    idDoc: idFile ? await toBase64(idFile) : null,
    addressDoc: addressFile ? await toBase64(addressFile) : null,
  };
};
