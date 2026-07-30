const forge = require('node-forge');
const fs = require('fs');

console.log("Generating 2048-bit Key Pair... (This may take up to 10-20 seconds)");

// 1. Generate the Keys (RSA Standard)
const keys = forge.pki.rsa.generateKeyPair(2048);

// 2. Create the Certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1); // Valid for 1 year

// 3. Add Identity Attributes (Church Intercom)
const attrs = [
  { name: 'commonName', value: 'ChurchIntercom' },
  { name: 'countryName', value: 'NG' },
  { shortName: 'ST', value: 'AkwaIbom' },
  { name: 'organizationName', value: 'AudioTeam' }
];
cert.setSubject(attrs);
cert.setIssuer(attrs);

// 4. Sign the Certificate with the Private Key
cert.sign(keys.privateKey);

// 5. Convert to PEM format (which Node.js understands)
const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
const pemCert = forge.pki.certificateToPem(cert);

// 6. Write to disk
fs.writeFileSync('key.pem', pemKey);
fs.writeFileSync('cert.pem', pemCert);

console.log("---------------------------------------------------");
console.log("SUCCESS! Created 'key.pem' and 'cert.pem'.");
console.log("You can now run 'node index.js'");
console.log("---------------------------------------------------");